using System.ComponentModel.DataAnnotations;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida")]
        public string Password { get; set; } = string.Empty;
    }

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

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserResponse User { get; set; } = new();
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public UserType Type { get; set; }
        public MembershipInfo? Membership { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdateUserRequest
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public MembershipInfo? Membership { get; set; }
    }

    public class UpdateMembershipRequest
    {
        [Required(ErrorMessage = "El estado de membresía es requerido")]
        public MembershipStatus Status { get; set; }

        public DateTime? ExpirationDate { get; set; }
    }
}