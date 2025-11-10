using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VendeTuAutoYa.Api.DTOs.Requests;
using VendeTuAutoYa.Api.Services;

namespace VendeTuAutoYa.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;
        private readonly ILogger<UserProfileController> _logger;

        public UserProfileController(
            IUserProfileService userProfileService,
            ILogger<UserProfileController> logger)
        {
            _userProfileService = userProfileService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            try
            {
                _logger.LogInformation("GetUserProfile called");
                var userId = GetCurrentUserId();
                _logger.LogInformation($"User ID: {userId}");
                var profile = await _userProfileService.GetUserProfileAsync(userId);

                if (profile == null)
                {
                    _logger.LogWarning($"Profile not found for user {userId}");
                    return NotFound("Perfil de usuario no encontrado");
                }

                _logger.LogInformation($"Profile found for user {userId}");
                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el perfil del usuario");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetCurrentUserId();
                var updatedProfile = await _userProfileService.UpdateUserProfileAsync(userId, request);

                if (updatedProfile == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                return Ok(updatedProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el perfil del usuario");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpPost("documents")]
        [Consumes("multipart/form-data")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UploadDocument([FromForm] string documentType, [FromForm] IFormFile file)
        {
            try
            {
                if (string.IsNullOrEmpty(documentType))
                {
                    return BadRequest("El tipo de documento es requerido");
                }

                if (file == null || file.Length == 0)
                {
                    return BadRequest("El archivo es requerido");
                }

                // Validar tipos de documento permitidos
                var allowedDocumentTypes = new[] { "DNI", "Estatuto", "AFIP" };
                if (!allowedDocumentTypes.Contains(documentType))
                {
                    return BadRequest($"Tipo de documento no válido. Tipos permitidos: {string.Join(", ", allowedDocumentTypes)}");
                }

                var userId = GetCurrentUserId();
                var document = await _userProfileService.UploadDocumentAsync(userId, documentType, file);

                if (document == null)
                {
                    return BadRequest("Error al subir el documento");
                }

                return Ok(document);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al subir documento");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpDelete("documents/{documentId}")]
        public async Task<IActionResult> DeleteDocument(int documentId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var deleted = await _userProfileService.DeleteDocumentAsync(userId, documentId);

                if (!deleted)
                {
                    return NotFound("Documento no encontrado");
                }

                return Ok(new { message = "Documento eliminado correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar documento");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpGet("documents/{documentId}/download")]
        public async Task<IActionResult> DownloadDocument(int documentId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _userProfileService.DownloadDocumentAsync(userId, documentId);

                if (result == null)
                {
                    return NotFound("Documento no encontrado");
                }

                var (fileContent, contentType, fileName) = result.Value;
                return File(fileContent, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al descargar documento");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpGet("completion-status")]
        public async Task<IActionResult> GetCompletionStatus()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _userProfileService.GetUserProfileAsync(userId);

                if (profile == null)
                {
                    return NotFound("Perfil de usuario no encontrado");
                }

                var completionStatus = new
                {
                    IsProfileComplete = profile.IsProfileComplete,
                    IsAddressComplete = profile.IsAddressComplete,
                    IsDocumentationComplete = profile.IsDocumentationComplete,
                    OverallComplete = profile.IsProfileComplete && profile.IsAddressComplete && profile.IsDocumentationComplete,
                    CompletionPercentage = CalculateCompletionPercentage(
                        profile.IsProfileComplete,
                        profile.IsAddressComplete,
                        profile.IsDocumentationComplete)
                };

                return Ok(completionStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el estado de completitud");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("ID de usuario no válido");
            }
            return userId;
        }

        private static int CalculateCompletionPercentage(bool isProfileComplete, bool isAddressComplete, bool isDocumentationComplete)
        {
            var completedSections = 0;
            var totalSections = 3;

            if (isProfileComplete) completedSections++;
            if (isAddressComplete) completedSections++;
            if (isDocumentationComplete) completedSections++;

            return (int)Math.Round((double)completedSections / totalSections * 100);
        }
    }
}