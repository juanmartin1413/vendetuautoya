using System.ComponentModel.DataAnnotations;

namespace VendeTuAutoYa.Api.Models
{
    public class Address
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Street { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(10)]
        public string Number { get; set; } = string.Empty;
        
        [MaxLength(10)]
        public string? Floor { get; set; }
        
        [MaxLength(10)]
        public string? Apartment { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty;
        
        [MaxLength(10)]
        public string? PostalCode { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}