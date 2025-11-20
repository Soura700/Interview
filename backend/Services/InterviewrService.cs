using backend.Interfaces;
using backend.Models;
using backend.DTO;
using backend.Utilities;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class InterviewerService : IInterviewerService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public InterviewerService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<Interviewer> CreateInterviewerAsync(CreateInterviewerDto dto)
    {

        var existing = await _context.Interviewers
    .FirstOrDefaultAsync(i => i.Email == dto.Email);

        if (existing != null)
            throw new Exception("Email already exists");

        var firstName = dto.FullName.Split(' ')[0];
        string defaultPassword = $"Welcome@{firstName}";
        string hashedPassword = PasswordHasher.Hash(defaultPassword);

        var interviewer = new Interviewer
        {
            FullName = dto.FullName,
            Email = dto.Email,
            SkillSet = dto.SkillSet,
            InterviewLevel = dto.InterviewLevel,
            ExperienceYears = dto.ExperienceYears,
            IsAvailable = dto.IsAvailable,
            PasswordHash = hashedPassword,
            FirstLogin = true
        };

        _context.Interviewers.Add(interviewer);
        await _context.SaveChangesAsync();

        // Sending the email to interviewer with credentials
        string subject = "Your Interviewer Account Created";
        string body = $"Hi {dto.FullName},\n\n" +
                      $"Your account has been created by the admin.\n\n" +
                      $"Login Email: {dto.Email}\n" +
                      $"Temporary Password: {defaultPassword}\n\n" +
                      $"Please log in and change your password after first login.\n\n" +
                      "Regards,\nInterview Management System";

        await _emailService.SendEmailAsync(dto.Email, subject, body);

        Console.WriteLine($"Generated password for {dto.FullName}: {defaultPassword}");
        return interviewer;
    }

    public async Task<Interviewer?> GetInterviewerByEmailAsync(string email)
    {
        return await _context.Interviewers
            .FirstOrDefaultAsync(x => x.Email == email);
    }


    public async Task<(string message, bool firstLogin)> LoginAsync(LoginDto dto)
    {
        var interviewer = await _context.Interviewers.FirstOrDefaultAsync(i => i.Email == dto.Email);
        if (interviewer == null)
            return ("Invalid Email or Password", false);

        string hashedInput = PasswordHasher.Hash(dto.Password);
        if (hashedInput != interviewer.PasswordHash)
            return ("Invalid Email or Password", false);

        if (interviewer.FirstLogin)
            return ("Please change your password (first-time login).", true);

        return ("Login successful.", false);
    }

    public async Task<string> ChangePasswordAsync(ChangePasswordDto dto)
    {
        var interviewer = await _context.Interviewers.FirstOrDefaultAsync(i => i.Email == dto.Email);
        if (interviewer == null)
            return "User not found.";

        string oldHash = PasswordHasher.Hash(dto.OldPassword);
        if (oldHash != interviewer.PasswordHash)
            return "Old password incorrect.";

        interviewer.PasswordHash = PasswordHasher.Hash(dto.NewPassword);
        interviewer.FirstLogin = false;
        await _context.SaveChangesAsync();

        return "Password changed successfully.";
    }

    public async Task<List<Interviewer>> GetAllInterviewersAsync()
    {
        return await _context.Interviewers.ToListAsync();
    }

    public async Task<int> GetInterviewerCountAsync()
    {
        return await _context.Interviewers.CountAsync();
    }
    public async Task<List<Interviewer>> GetAllInterviewersAsync(int page, int pageSize)
     {
         return await _context.Interviewers
             .OrderBy(i => i.Id)
             .Skip((page - 1) * pageSize)
             .Take(pageSize)
             .ToListAsync();
     }

}
