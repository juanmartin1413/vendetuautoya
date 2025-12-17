using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendeTuAutoYa.Api.DTOs.Requests;
using VendeTuAutoYa.Api.DTOs.Responses;
using VendeTuAutoYa.Api.Services;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UsersController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost("filter")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<PaginatedResponse<UserResponse>>> GetUsersWithFilters([FromBody] UserFilterRequest filter)
        {
            var result = await _authService.GetUsersWithFiltersAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<UserResponse>> GetUser(int id)
        {
            var user = await _authService.GetUserByIdAsync(id);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<UserResponse>> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _authService.UpdateUserAsync(id, request);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var result = await _authService.DeleteUserAsync(id);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost("{id}/membership")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<UserResponse>> UpdateMembership(int id, [FromBody] UpdateMembershipRequest request)
        {
            var user = await _authService.UpdateUserMembershipAsync(id, request.Status, request.ExpirationDate);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("by-type/{userType}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsersByType(UserType userType)
        {
            var users = await _authService.GetUsersByTypeAsync(userType);
            return Ok(users);
        }

        [HttpPost("{id}/observations")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<UserResponse>> AddObservation(int id, [FromBody] AddObservationRequest request)
        {
            // Obtener email del admin del token
            var adminEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "admin@system.com";
            
            var user = await _authService.AddObservationAsync(id, request.Observation, adminEmail);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<UserResponse>> UpdateUserStatus(int id, [FromBody] UpdateUserStatusRequest request)
        {
            // Obtener email del admin del token
            var adminEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "admin@system.com";
            
            // Parsear el status string a enum
            if (!Enum.TryParse<UserStatus>(request.Status, true, out var newStatus))
            {
                return BadRequest("Invalid status value");
            }
            
            var user = await _authService.UpdateUserStatusAsync(id, newStatus, request.Observation, adminEmail);
            
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("{id}/observations")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<List<UserObservationResponse>>> GetUserObservations(int id)
        {
            var observations = await _authService.GetUserObservationsAsync(id);
            return Ok(observations);
        }

        [HttpGet("{userId}/documents/{documentId}/download")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DownloadUserDocument(int userId, int documentId)
        {
            var document = await _authService.GetUserDocumentAsync(userId, documentId);
            
            if (document == null)
            {
                return NotFound("Documento no encontrado");
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), document.FilePath.TrimStart('/'));
            
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Archivo no encontrado en el servidor");
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, document.ContentType, document.FileName);
        }
    }
}