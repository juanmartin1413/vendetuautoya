using System.ComponentModel.DataAnnotations;

namespace VendeTuAutoYa.Api.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        
        // Campos comunes para todos los usuarios
        [MaxLength(100)]
        public string? FirstName { get; set; }
        
        [MaxLength(100)]
        public string? LastName { get; set; }
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        [MaxLength(20)]
        public string? DocumentNumber { get; set; } // DNI/CUIT/CUIL
        
        // Campos específicos para concesionarios
        [MaxLength(11)]
        public string? Cuit { get; set; }
        
        [MaxLength(200)]
        public string? BusinessName { get; set; }
        
        [MaxLength(200)]
        public string? LegalRepresentative { get; set; }
        
        // Campos de verificación
        public bool IsProfileComplete { get; set; } = false;
        public bool IsDocumentationComplete { get; set; } = false;
        public bool IsAddressComplete { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public Address? Address { get; set; }
        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}