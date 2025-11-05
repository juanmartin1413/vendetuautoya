using System.ComponentModel.DataAnnotations;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.DTOs.Requests
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es requerido")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono es requerido")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tipo de usuario es requerido")]
        public UserType Type { get; set; }
    }
}