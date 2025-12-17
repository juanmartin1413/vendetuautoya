using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VendeTuAutoYa.Api.Data;
using VendeTuAutoYa.Api.DTOs.Requests;
using VendeTuAutoYa.Api.DTOs.Responses;
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
        Task<PaginatedResponse<UserResponse>> GetUsersWithFiltersAsync(UserFilterRequest filter);
        Task<IEnumerable<UserResponse>> GetUsersByTypeAsync(UserType userType);
        Task<UserResponse?> UpdateUserMembershipAsync(int id, MembershipStatus status, DateTime? expirationDate);
        Task<UserResponse?> AddObservationAsync(int userId, string observation, string authorEmail);
        Task<UserResponse?> UpdateUserStatusAsync(int userId, UserStatus newStatus, string? observation, string authorEmail);
        Task<List<UserObservationResponse>> GetUserObservationsAsync(int userId);
        Task<Document?> GetUserDocumentAsync(int userId, int documentId);
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
                Phone = string.Empty, // Se completará después en "Mis datos"
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Debug log para verificar el tipo al crear usuario
            Console.WriteLine($"Creating user with Type: {user.Type} ({(int)user.Type})");

            // Si es concesionario, agregar membresía free por defecto
            if (request.Type == UserType.Concesionario)
            {
                user.Membership = new MembershipInfo
                {
                    Status = MembershipStatus.Free,
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
            if (user == null)
                return null;
                
            var userResponse = MapToUserResponse(user);
            userResponse.Observations = await GetUserObservationsAsync(userId);
            
            // Cargar el perfil completo del usuario con dirección
            var userProfile = await _context.UserProfiles
                .Include(up => up.Address)
                .FirstOrDefaultAsync(up => up.UserId == userId);
            
            if (userProfile != null)
            {
                // Cargar los documentos del usuario directamente desde Documents
                var documents = await _context.Documents
                    .Where(d => d.UserId == userId && d.IsActive)
                    .ToListAsync();
                
                userResponse.UserProfile = MapToUserProfileResponse(userProfile, documents);
            }
            
            return userResponse;
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

            // Soft delete: marcar como eliminado en lugar de eliminar físicamente
            user.IsDeleted = true;
            user.DeletedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(MapToUserResponse);
        }

        public async Task<PaginatedResponse<UserResponse>> GetUsersWithFiltersAsync(UserFilterRequest filter)
        {
            var query = _context.Users.AsQueryable();

            // Debug logging
            Console.WriteLine($"Filter DateFrom: {filter.DateFrom}, DateTo: {filter.DateTo}");

            // Filtro por email
            if (!string.IsNullOrWhiteSpace(filter.Email))
            {
                query = query.Where(u => u.Email.ToLower().Contains(filter.Email.ToLower()));
            }

            // Filtro por tipo de usuario
            if (filter.UserType.HasValue && filter.UserType.Value > 0)
            {
                query = query.Where(u => (int)u.Type == filter.UserType.Value);
            }

            // Filtro por estado
            if (filter.Status.HasValue && filter.Status.Value > 0)
            {
                query = query.Where(u => (int)u.Status == filter.Status.Value);
            }

            // Filtro por rango de fechas
            if (filter.DateFrom.HasValue)
            {
                // Crear DateTime con Kind=Utc desde el principio
                var dateOnly = filter.DateFrom.Value.Date;
                var startDate = new DateTime(dateOnly.Year, dateOnly.Month, dateOnly.Day, 0, 0, 0, DateTimeKind.Utc);
                Console.WriteLine($"Filtering CreatedAt >= {startDate:yyyy-MM-dd HH:mm:ss} UTC");
                query = query.Where(u => u.CreatedAt >= startDate);
            }

            if (filter.DateTo.HasValue)
            {
                // Crear DateTime con Kind=Utc, incluyendo todo el día
                var dateOnly = filter.DateTo.Value.Date;
                var endDate = new DateTime(dateOnly.Year, dateOnly.Month, dateOnly.Day, 23, 59, 59, 999, DateTimeKind.Utc).AddMilliseconds(1);
                Console.WriteLine($"Filtering CreatedAt < {endDate:yyyy-MM-dd HH:mm:ss} UTC");
                query = query.Where(u => u.CreatedAt < endDate);
            }

            // Filtro para incluir/excluir eliminados
            if (!filter.IncludeDeleted)
            {
                query = query.Where(u => !u.IsDeleted);
            }

            // Contar total antes de paginar
            var totalCount = await query.CountAsync();

            // Ordenamiento
            query = filter.SortBy?.ToLower() switch
            {
                "name" => filter.SortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(u => u.Name) 
                    : query.OrderByDescending(u => u.Name),
                "email" => filter.SortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(u => u.Email) 
                    : query.OrderByDescending(u => u.Email),
                _ => filter.SortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(u => u.CreatedAt) 
                    : query.OrderByDescending(u => u.CreatedAt)
            };

            // Paginación
            var skip = (filter.Page - 1) * filter.PageSize;
            query = query.Skip(skip).Take(filter.PageSize);

            var users = await query.ToListAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize);

            return new PaginatedResponse<UserResponse>
            {
                Items = users.Select(MapToUserResponse).ToList(),
                TotalCount = totalCount,
                Page = filter.Page,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = filter.Page > 1,
                HasNextPage = filter.Page < totalPages
            };
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

        public async Task<List<UserObservationResponse>> GetUserObservationsAsync(int userId)
        {
            var observations = await _context.UserObservations
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new UserObservationResponse
                {
                    Id = o.Id,
                    Observation = o.Observation,
                    AuthorEmail = o.AuthorEmail,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return observations;
        }

        public async Task<UserResponse?> AddObservationAsync(int userId, string observation, string authorEmail)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return null;

            var newObservation = new UserObservation
            {
                UserId = userId,
                Observation = observation,
                AuthorEmail = authorEmail,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserObservations.Add(newObservation);
            
            // Actualizar el comentario de observación actual del usuario
            user.ObservationComment = observation;
            user.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            var userResponse = MapToUserResponse(user);
            userResponse.Observations = await GetUserObservationsAsync(userId);
            
            return userResponse;
        }

        public async Task<UserResponse?> UpdateUserStatusAsync(int userId, UserStatus newStatus, string? observation, string authorEmail)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return null;

            user.Status = newStatus;
            user.UpdatedAt = DateTime.UtcNow;

            // Si se proporciona una observación, agregarla
            if (!string.IsNullOrWhiteSpace(observation))
            {
                var newObservation = new UserObservation
                {
                    UserId = userId,
                    Observation = observation,
                    AuthorEmail = authorEmail,
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.UserObservations.Add(newObservation);
                user.ObservationComment = observation;
            }

            await _context.SaveChangesAsync();

            var userResponse = MapToUserResponse(user);
            userResponse.Observations = await GetUserObservationsAsync(userId);
            
            return userResponse;
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
                UpdatedAt = user.UpdatedAt,
                IsEmailVerified = user.IsEmailVerified,
                IsDeleted = user.IsDeleted,
                DeletedAt = user.DeletedAt,
                Status = user.Status,
                ObservationComment = user.ObservationComment,
                Observations = new List<UserObservationResponse>() // Se llenará cuando sea necesario
            };
        }

        public async Task<Document?> GetUserDocumentAsync(int userId, int documentId)
        {
            var document = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == documentId && d.UserId == userId && d.IsActive);
            
            return document;
        }

        private static UserProfileResponse MapToUserProfileResponse(UserProfile userProfile, List<Document> documents)
        {
            var response = new UserProfileResponse
            {
                Id = userProfile.Id,
                FirstName = userProfile.FirstName,
                LastName = userProfile.LastName,
                Phone = userProfile.Phone,
                DocumentNumber = userProfile.DocumentNumber,
                Cuit = userProfile.Cuit,
                BusinessName = userProfile.BusinessName,
                LegalRepresentative = userProfile.LegalRepresentative,
                IsProfileComplete = userProfile.IsProfileComplete,
                IsDocumentationComplete = userProfile.IsDocumentationComplete,
                IsAddressComplete = userProfile.IsAddressComplete,
                CreatedAt = userProfile.CreatedAt,
                UpdatedAt = userProfile.UpdatedAt
            };

            if (userProfile.Address != null)
            {
                response.Address = new DTOs.Responses.AddressResponse
                {
                    Id = userProfile.Address.Id,
                    Street = userProfile.Address.Street,
                    Number = userProfile.Address.Number,
                    Floor = userProfile.Address.Floor,
                    Apartment = userProfile.Address.Apartment,
                    City = userProfile.Address.City,
                    Province = userProfile.Address.Province,
                    PostalCode = userProfile.Address.PostalCode
                };
            }

            response.Documents = documents.Select(d => new DTOs.Responses.DocumentResponse
            {
                Id = d.Id,
                DocumentType = d.DocumentType,
                FileName = d.FileName,
                ContentType = d.ContentType,
                FileSize = d.FileSize,
                UploadedAt = d.UploadedAt,
                IsActive = d.IsActive
            }).ToList();

            return response;
        }
    }
}