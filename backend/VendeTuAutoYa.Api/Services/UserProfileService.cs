using Microsoft.EntityFrameworkCore;
using VendeTuAutoYa.Api.Data;
using VendeTuAutoYa.Api.DTOs.Requests;
using VendeTuAutoYa.Api.DTOs.Responses;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UserProfileService> _logger;

        public UserProfileService(
            ApplicationDbContext context, 
            IWebHostEnvironment environment,
            ILogger<UserProfileService> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<UserProfileResponse?> GetUserProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .ThenInclude(p => p!.Address)
                .Include(u => u.Documents.Where(d => d.IsActive))
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return null;

            // Si no tiene perfil, crear uno vacío
            if (user.Profile == null)
            {
                user.Profile = new UserProfile
                {
                    UserId = userId,
                    User = user
                };
                _context.UserProfiles.Add(user.Profile);
                await _context.SaveChangesAsync();
            }

            // Cargar documentos activos del usuario
            var documents = await _context.Documents
                .Where(d => d.UserId == userId && d.IsActive)
                .ToListAsync();

            return MapToUserProfileResponse(user.Profile, documents);
        }

        public async Task<UserProfileResponse?> UpdateUserProfileAsync(int userId, UpdateUserProfileRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .ThenInclude(p => p!.Address)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return null;

            // Crear perfil si no existe
            if (user.Profile == null)
            {
                user.Profile = new UserProfile
                {
                    UserId = userId,
                    User = user
                };
                _context.UserProfiles.Add(user.Profile);
            }

            // Actualizar campos del perfil
            user.Profile.FirstName = request.FirstName;
            user.Profile.LastName = request.LastName;
            user.Profile.Phone = request.Phone;
            user.Profile.DocumentNumber = request.DocumentNumber;
            user.Profile.Cuit = request.Cuit;
            user.Profile.BusinessName = request.BusinessName;
            user.Profile.LegalRepresentative = request.LegalRepresentative;
            user.Profile.UpdatedAt = DateTime.UtcNow;

            // Actualizar o crear dirección
            if (request.Address != null)
            {
                if (user.Profile.Address == null)
                {
                    user.Profile.Address = new Address
                    {
                        UserId = userId,
                        User = user
                    };
                    _context.Addresses.Add(user.Profile.Address);
                }

                user.Profile.Address.Street = request.Address.Street;
                user.Profile.Address.Number = request.Address.Number;
                user.Profile.Address.Floor = request.Address.Floor;
                user.Profile.Address.Apartment = request.Address.Apartment;
                user.Profile.Address.City = request.Address.City;
                user.Profile.Address.Province = request.Address.Province;
                user.Profile.Address.PostalCode = request.Address.PostalCode;
                user.Profile.Address.UpdatedAt = DateTime.UtcNow;
                
                user.Profile.IsAddressComplete = !string.IsNullOrEmpty(request.Address.Street) &&
                                               !string.IsNullOrEmpty(request.Address.Number) &&
                                               !string.IsNullOrEmpty(request.Address.City) &&
                                               !string.IsNullOrEmpty(request.Address.Province);
            }

            // Actualizar estado de completitud del perfil según el tipo de usuario
            if (user.Type == UserType.Concesionario)
            {
                // Para concesionarios: validar CUIT, BusinessName y Phone
                user.Profile.IsProfileComplete = !string.IsNullOrEmpty(user.Profile.Cuit) &&
                                               !string.IsNullOrEmpty(user.Profile.BusinessName) &&
                                               !string.IsNullOrEmpty(user.Profile.Phone);
            }
            else
            {
                // Para vendedores: validar FirstName, LastName y Phone
                user.Profile.IsProfileComplete = !string.IsNullOrEmpty(user.Profile.FirstName) &&
                                               !string.IsNullOrEmpty(user.Profile.LastName) &&
                                               !string.IsNullOrEmpty(user.Profile.Phone);
            }

            await _context.SaveChangesAsync();

            return MapToUserProfileResponse(user.Profile);
        }

        public async Task<DocumentResponse?> UploadDocumentAsync(int userId, string documentType, IFormFile file)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            // Validar archivo
            if (file == null || file.Length == 0)
                throw new ArgumentException("Archivo no válido");

            if (file.ContentType != "application/pdf")
                throw new ArgumentException("Solo se permiten archivos PDF");

            if (file.Length > 10 * 1024 * 1024) // 10MB
                throw new ArgumentException("El archivo no debe superar los 10MB");

            // Crear directorio si no existe
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "documents", userId.ToString());
            Directory.CreateDirectory(uploadsPath);

            // Generar nombre único para el archivo
            var fileName = $"{documentType}_{DateTime.UtcNow:yyyyMMdd_HHmmss}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Guardar archivo
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Desactivar documentos anteriores del mismo tipo
            var existingDocs = await _context.Documents
                .Where(d => d.UserId == userId && d.DocumentType == documentType && d.IsActive)
                .ToListAsync();

            foreach (var doc in existingDocs)
            {
                doc.IsActive = false;
            }

            // Crear registro en base de datos
            var document = new Document
            {
                UserId = userId,
                DocumentType = documentType,
                FileName = file.FileName,
                FilePath = filePath,
                ContentType = file.ContentType,
                FileSize = file.Length,
                UploadedAt = DateTime.UtcNow,
                IsActive = true,
                User = user
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Actualizar estado de documentación
            await UpdateDocumentationStatusAsync(userId);

            return new DocumentResponse
            {
                Id = document.Id,
                DocumentType = document.DocumentType,
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSize = document.FileSize,
                UploadedAt = document.UploadedAt,
                IsActive = document.IsActive
            };
        }

        public async Task<bool> DeleteDocumentAsync(int userId, int documentId)
        {
            var document = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == documentId && d.UserId == userId && d.IsActive);

            if (document == null) return false;

            // Marcar como inactivo
            document.IsActive = false;
            await _context.SaveChangesAsync();

            // Actualizar estado de documentación
            await UpdateDocumentationStatusAsync(userId);

            // Opcionalmente eliminar archivo físico
            try
            {
                if (File.Exists(document.FilePath))
                {
                    File.Delete(document.FilePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "No se pudo eliminar el archivo físico: {FilePath}", document.FilePath);
            }

            return true;
        }

        public async Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadDocumentAsync(int userId, int documentId)
        {
            var document = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == documentId && d.UserId == userId && d.IsActive);

            if (document == null || !File.Exists(document.FilePath))
                return null;

            var fileContent = await File.ReadAllBytesAsync(document.FilePath);
            return (fileContent, document.ContentType, document.FileName);
        }

        private async Task UpdateDocumentationStatusAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Documents.Where(d => d.IsActive))
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user?.Profile == null) return;

            // Para concesionarios, verificar que tengan estatuto y AFIP
            if (user.Type == UserType.Concesionario)
            {
                var hasEstatuto = user.Documents.Any(d => d.DocumentType == "Estatuto" && d.IsActive);
                var hasAfip = user.Documents.Any(d => d.DocumentType == "AFIP" && d.IsActive);
                
                user.Profile.IsDocumentationComplete = hasEstatuto && hasAfip;
            }
            else
            {
                // Para vendedores, verificar DNI
                var hasDni = user.Documents.Any(d => d.DocumentType == "DNI" && d.IsActive);
                user.Profile.IsDocumentationComplete = hasDni;
            }

            await _context.SaveChangesAsync();
        }

        private UserProfileResponse MapToUserProfileResponse(UserProfile profile, List<Document>? documents = null)
        {
            var docsToMap = documents ?? profile.Documents.Where(d => d.IsActive).ToList();
            
            return new UserProfileResponse
            {
                Id = profile.Id,
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                Phone = profile.Phone,
                DocumentNumber = profile.DocumentNumber,
                Cuit = profile.Cuit,
                BusinessName = profile.BusinessName,
                LegalRepresentative = profile.LegalRepresentative,
                IsProfileComplete = profile.IsProfileComplete,
                IsDocumentationComplete = profile.IsDocumentationComplete,
                IsAddressComplete = profile.IsAddressComplete,
                Address = profile.Address != null ? new AddressResponse
                {
                    Id = profile.Address.Id,
                    Street = profile.Address.Street,
                    Number = profile.Address.Number,
                    Floor = profile.Address.Floor,
                    Apartment = profile.Address.Apartment,
                    City = profile.Address.City,
                    Province = profile.Address.Province,
                    PostalCode = profile.Address.PostalCode
                } : null,
                Documents = docsToMap.Select(d => new DocumentResponse
                {
                    Id = d.Id,
                    DocumentType = d.DocumentType,
                    FileName = d.FileName,
                    ContentType = d.ContentType,
                    FileSize = d.FileSize,
                    UploadedAt = d.UploadedAt,
                    IsActive = d.IsActive
                }).ToList(),
                CreatedAt = profile.CreatedAt,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}