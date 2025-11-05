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
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "administrador")]
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
        [Authorize(Roles = "administrador")]
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
        [Authorize(Roles = "administrador")]
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
        [Authorize(Roles = "administrador")]
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
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsersByType(UserType userType)
        {
            var users = await _authService.GetUsersByTypeAsync(userType);
            return Ok(users);
        }
    }
}