using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VendeTuAutoYa.Api.Data;
using VendeTuAutoYa.Api.DTOs;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<UserResponse?> GetUserByIdAsync(int id);
        Task<UserResponse?> UpdateUserAsync(int id, UpdateUserRequest request);
        Task<bool> DeleteUserAsync(int id);
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();
        Task<IEnumerable<UserResponse>> GetUsersByTypeAsync(UserType userType);
        Task<UserResponse?> UpdateUserMembershipAsync(int id, MembershipStatus status, DateTime? expirationDate);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);
            
            return new AuthResponse
            {
                Token = token,
                User = MapToUserResponse(user)
            };
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            // Verificar si el usuario ya existe
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Name = request.Name,
                Phone = request.Phone,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Si es concesionario, agregar membresía free por defecto
            if (request.Type == UserType.concesionario)
            {
                user.Membership = new MembershipInfo
                {
                    Status = MembershipStatus.free,
                    ExpirationDate = null,
                    LastPaymentDate = null,
                    AutoRenew = false
                };
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                User = MapToUserResponse(user)
            };
        }

        public async Task<UserResponse?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user != null ? MapToUserResponse(user) : null;
        }

        public async Task<UserResponse?> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return null;

            if (!string.IsNullOrEmpty(request.Name))
            {
                user.Name = request.Name;
            }

            if (!string.IsNullOrEmpty(request.Phone))
            {
                user.Phone = request.Phone;
            }

            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            }

            if (request.Membership != null)
            {
                user.Membership = request.Membership;
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToUserResponse(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(MapToUserResponse);
        }

        public async Task<IEnumerable<UserResponse>> GetUsersByTypeAsync(UserType userType)
        {
            var users = await _context.Users
                .Where(u => u.Type == userType)
                .ToListAsync();
            return users.Select(MapToUserResponse);
        }

        public async Task<UserResponse?> UpdateUserMembershipAsync(int id, MembershipStatus status, DateTime? expirationDate)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return null;

            if (user.Membership == null)
            {
                user.Membership = new MembershipInfo();
            }

            user.Membership.Status = status;
            user.Membership.ExpirationDate = expirationDate;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToUserResponse(user);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Type.ToString()),
                new Claim("UserType", user.Type.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserResponse MapToUserResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Phone = user.Phone,
                Type = user.Type,
                Membership = user.Membership,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}