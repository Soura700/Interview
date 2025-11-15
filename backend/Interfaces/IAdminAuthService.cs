using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface IAdminAuthService
    {
        Task<Admin?> GetAdminByEmail(string email);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
        string GenerateJwtToken(Admin admin);
    }
}