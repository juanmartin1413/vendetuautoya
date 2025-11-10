namespace VendeTuAutoYa.Api.DTOs.Requests
{
    public class UpdateUserProfileRequest
    {
        // Campos comunes
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? DocumentNumber { get; set; }
        
        // Campos específicos para concesionarios
        public string? Cuit { get; set; }
        public string? BusinessName { get; set; }
        public string? LegalRepresentative { get; set; }
        
        // Dirección
        public AddressRequest? Address { get; set; }
    }
    
    public class AddressRequest
    {
        public string Street { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string? Floor { get; set; }
        public string? Apartment { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
    }
}