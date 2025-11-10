using VendeTuAutoYa.Api.DTOs.Requests;
using VendeTuAutoYa.Api.DTOs.Responses;

namespace VendeTuAutoYa.Api.Services
{
    public interface IUserProfileService
    {
        Task<UserProfileResponse?> GetUserProfileAsync(int userId);
        Task<UserProfileResponse?> UpdateUserProfileAsync(int userId, UpdateUserProfileRequest request);
        Task<DocumentResponse?> UploadDocumentAsync(int userId, string documentType, IFormFile file);
        Task<bool> DeleteDocumentAsync(int userId, int documentId);
        Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadDocumentAsync(int userId, int documentId);
    }
}