using backend.Models;

namespace backend.Interfaces
{
    public interface ICandidateAuthService
    {
        Task<Candidate?> GetCandidateByEmail(string email);
        bool VerifyPassword(string password, string hash);
        string GenerateJwtToken(Candidate candidate);
    }
}