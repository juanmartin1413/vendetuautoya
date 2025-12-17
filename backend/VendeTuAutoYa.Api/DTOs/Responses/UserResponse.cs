using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.DTOs.Responses
{
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
        
        // Nuevos campos para administración
        public bool IsEmailVerified { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public UserStatus Status { get; set; }
        public string? ObservationComment { get; set; }
        public List<UserObservationResponse> Observations { get; set; } = new List<UserObservationResponse>();
        
        // Perfil completo del usuario
        public UserProfileResponse? UserProfile { get; set; }
    }
}