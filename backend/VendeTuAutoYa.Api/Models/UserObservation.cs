namespace VendeTuAutoYa.Api.Models
{
    public class UserObservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Observation { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty; // Email del admin que creó la observación
        public DateTime CreatedAt { get; set; }
        
        // Navigation property
        public User User { get; set; } = null!;
    }
}
