using VendeTuAutoYa.Api.DTOs.Responses;

namespace VendeTuAutoYa.Api.DTOs.Responses
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserResponse User { get; set; } = new();
    }
}