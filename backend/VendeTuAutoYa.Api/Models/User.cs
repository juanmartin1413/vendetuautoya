using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace VendeTuAutoYa.Api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public UserType Type { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        // Para almacenar información de membresía como JSON en la base de datos
        [Column(TypeName = "jsonb")]
        public string? MembershipJson { get; set; }

        // Propiedad no mapeada para trabajar con el objeto MembershipInfo
        [NotMapped]
        public MembershipInfo? Membership
        {
            get
            {
                if (string.IsNullOrEmpty(MembershipJson))
                    return null;
                
                try
                {
                    return JsonSerializer.Deserialize<MembershipInfo>(MembershipJson);
                }
                catch
                {
                    return null;
                }
            }
            set
            {
                if (value == null)
                {
                    MembershipJson = null;
                }
                else
                {
                    MembershipJson = JsonSerializer.Serialize(value);
                }
            }
        }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public UserProfile? Profile { get; set; }
        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}