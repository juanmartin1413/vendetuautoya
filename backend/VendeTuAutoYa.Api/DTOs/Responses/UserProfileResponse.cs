namespace VendeTuAutoYa.Api.DTOs.Responses
{
    public class UserProfileResponse
    {
        public int Id { get; set; }
        
        // Campos comunes
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? DocumentNumber { get; set; }
        
        // Campos específicos para concesionarios
        public string? Cuit { get; set; }
        public string? BusinessName { get; set; }
        public string? LegalRepresentative { get; set; }
        
        // Estado de completitud
        public bool IsProfileComplete { get; set; }
        public bool IsDocumentationComplete { get; set; }
        public bool IsAddressComplete { get; set; }
        
        // Dirección
        public AddressResponse? Address { get; set; }
        
        // Documentos
        public List<DocumentResponse> Documents { get; set; } = new();
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    
    public class AddressResponse
    {
        public int Id { get; set; }
        public string Street { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string? Floor { get; set; }
        public string? Apartment { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
    }
    
    public class DocumentResponse
    {
        public int Id { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
        public bool IsActive { get; set; }
    }
}