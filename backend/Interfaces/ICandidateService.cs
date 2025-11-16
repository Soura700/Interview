using backend.Models;
using backend.DTO;

namespace backend.Interfaces;

public interface ICandidateService
{
    Task<Candidate> CreateCandidateAsync(CreateCandidateDto dto);
    Task<(string message, bool firstLogin)> LoginAsync(LoginDto dto);
    Task<string> ChangePasswordAsync(ChangePasswordDto dto);

    Task<Candidate?> GetCandidateByEmailAsync(string email);
    Task UpdateResumePathAsync(Candidate candidate);

    // 
    // 
    // 
    Task<Candidate?> GetCandidateByIdAsync(int id);



}
