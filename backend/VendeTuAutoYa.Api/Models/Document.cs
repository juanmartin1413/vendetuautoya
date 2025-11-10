using System.ComponentModel.DataAnnotations;

namespace VendeTuAutoYa.Api.Models
{
    public class Document
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string DocumentType { get; set; } = string.Empty; // "Estatuto", "AFIP", "DNI", etc.
        
        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string ContentType { get; set; } = string.Empty; // "application/pdf"
        
        public long FileSize { get; set; }
        
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}