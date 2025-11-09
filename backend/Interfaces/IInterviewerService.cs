using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Interfaces;

public interface IInterviewerService
{
    Task<Interviewer> CreateInterviewerAsync(CreateInterviewerDto dto);
    Task<(string message, bool firstLogin)> LoginAsync(LoginDto dto);
    Task<string> ChangePasswordAsync(ChangePasswordDto dto);
    Task<List<Interviewer>> GetAllInterviewersAsync();
}