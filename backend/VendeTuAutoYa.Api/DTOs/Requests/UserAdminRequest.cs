namespace VendeTuAutoYa.Api.DTOs.Requests
{
    public class AddObservationRequest
    {
        public string Observation { get; set; } = string.Empty;
    }
    
    public class UpdateUserStatusRequest
    {
        public string Status { get; set; } = string.Empty; // "Activo", "Observado", etc.
        public string? Observation { get; set; } // Opcional, para cuando se rechaza
    }
}
