using System.ComponentModel.DataAnnotations;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.DTOs.Requests
{
    public class UpdateMembershipRequest
    {
        [Required(ErrorMessage = "El estado de membresía es requerido")]
        public MembershipStatus Status { get; set; }

        public DateTime? ExpirationDate { get; set; }
    }
}