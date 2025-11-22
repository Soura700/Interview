using backend.Models;
using backend.DTO;

namespace backend.Interfaces;

public interface ICandidateService
{
    Task<Candidate> CreateCandidateAsync(CreateCandidateDto dto);

    
    // Get paginated candidates
    Task<List<Candidate>> GetAllCandidatesAsync(int page, int pageSize);

    // Get total count (REQUIRED FOR PAGINATION)
    Task<int> GetCandidateCountAsync();

    Task<(string message, bool firstLogin)> LoginAsync(LoginDto dto);
    Task<string> ChangePasswordAsync(ChangePasswordDto dto);

    Task<Candidate?> GetCandidateByEmailAsync(string email);
    Task UpdateResumePathAsync(Candidate candidate);

    Task<Candidate?> GetCandidateByIdAsync(int id);

    Task<List<CandidateOfferDto>> GetCandidatesWithOfferStatusAsync();


}
