using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VendeTuAutoYa.Api.DTOs.Requests;
using VendeTuAutoYa.Api.DTOs.Responses;
using VendeTuAutoYa.Api.Services;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(request);
            
            if (result == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validar que el tipo de usuario sea válido
            if (request.Type == 0 || !Enum.IsDefined(typeof(UserType), request.Type))
            {
                return BadRequest(new { message = "Por favor selecciona para qué deseas utilizar la aplicación." });
            }

            // Debug log para verificar el tipo que llega
            Console.WriteLine($"RegisterRequest received - Type: {request.Type} ({(int)request.Type}), Name: {request.Name}, Email: {request.Email}");

            var result = await _authService.RegisterAsync(request);
            
            if (result == null)
            {
                return BadRequest(new { message = "Este email ya está registrado. Si ya tienes una cuenta, inicia sesión o usa un email diferente." });
            }

            return Created("", result);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var user = await _authService.GetUserByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> UpdateCurrentUser([FromBody] UpdateUserRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var user = await _authService.UpdateUserAsync(userId, request);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}