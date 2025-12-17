namespace VendeTuAutoYa.Api.DTOs.Responses
{
    public class UserObservationResponse
    {
        public int Id { get; set; }
        public string Observation { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
