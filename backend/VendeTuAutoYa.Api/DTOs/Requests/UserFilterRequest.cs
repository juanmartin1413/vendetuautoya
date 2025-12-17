namespace VendeTuAutoYa.Api.DTOs.Requests
{
    public class UserFilterRequest
    {
        public string? Email { get; set; }
        public int? UserType { get; set; } // null = todos
        public int? Status { get; set; } // null = todos, 1=Activo, 2=PendienteDeValidacion, 3=PendienteDeInformacion, 4=Observado
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public bool IncludeDeleted { get; set; } = false;
        
        // Paginación
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        
        // Ordenamiento
        public string? SortBy { get; set; } = "CreatedAt"; // CreatedAt, Name, Email
        public string? SortOrder { get; set; } = "desc"; // asc, desc
    }
}
