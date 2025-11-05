using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.DTOs.Requests
{
    public class UpdateUserRequest
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public MembershipInfo? Membership { get; set; }
    }
}