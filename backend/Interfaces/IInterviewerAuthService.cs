using backend.Models;

namespace backend.Interfaces
{
    public interface IInterviewerAuthService
    {
        Task<Interviewer?> GetInterviewerByEmail(string email);
        bool VerifyPassword(string password, string storedHash);
        string GenerateJwtToken(Interviewer interviewer);
        
    }
}
