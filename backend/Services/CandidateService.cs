using backend.Interfaces;
using backend.Models;
using backend.Data;
using backend.DTO;
using backend.Utilities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CandidateService : ICandidateService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public CandidateService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // Create candidate method
    public async Task<Candidate> CreateCandidateAsync(CreateCandidateDto dto)
    {
        // Check if email already exists
        var existingCandidate = await _context.Candidates
            .FirstOrDefaultAsync(c => c.Email == dto.Email);

        if (existingCandidate != null)
        {
            throw new Exception("This email ID already exists. Please use another one.");
        }

        // Generate default password
        var firstName = dto.FullName.Split(' ')[0];
        string defaultPassword = $"Welcome@{firstName}";
        string hashedPassword = PasswordHasher.Hash(defaultPassword);

        var candidate = new Candidate
        {
            FullName = dto.FullName,
            Email = dto.Email,
            SkillSet = dto.SkillSet,
            ResumePath = dto.ResumePath,
            ExperienceYears = dto.ExperienceYears,
            PasswordHash = hashedPassword,
            FirstLogin = true
        };

        _context.Candidates.Add(candidate);
        await _context.SaveChangesAsync();

        // Send login email
        string subject = "Welcome to Interview Management System";
        string body = $"Hi {dto.FullName},\n\n" +
                      $"Your candidate profile has been created.\n\n" +
                      $"Login Email: {dto.Email}\n" +
                      $"Temporary Password: {defaultPassword}\n\n" +
                      "Please log in and change your password at first login.";

        await _emailService.SendEmailAsync(dto.Email, subject, body);

        return candidate;
    }

    // GET PAGINATED CANDIDATES
    public async Task<List<Candidate>> GetAllCandidatesAsync(int page, int pageSize)
    {
        return await _context.Candidates
            .OrderBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    // GET TOTAL CANDIDATE COUNT
    public async Task<int> GetCandidateCountAsync()
    {
        return await _context.Candidates.CountAsync();
    }




    // Login method
    public async Task<(string message, bool firstLogin)> LoginAsync(LoginDto dto)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == dto.Email);
        if (candidate == null)
            return ("Invalid Email or Password", false);

        string hashedInput = PasswordHasher.Hash(dto.Password);
        if (hashedInput != candidate.PasswordHash)
            return ("Invalid Email or Password", false);

        if (candidate.FirstLogin)
            return ("Please change your password (first-time login).", true);

        return ("Login successful.", false);
    }

    // Change password method
    public async Task<string> ChangePasswordAsync(ChangePasswordDto dto)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == dto.Email);
        if (candidate == null)
            return "User not found.";

        string oldHash = PasswordHasher.Hash(dto.OldPassword);
        if (oldHash != candidate.PasswordHash)
            return "Old password incorrect.";

        candidate.PasswordHash = PasswordHasher.Hash(dto.NewPassword);
        candidate.FirstLogin = false;
        await _context.SaveChangesAsync();

        return "Password changed successfully.";
    }

    // Get candidate by email
    public async Task<Candidate?> GetCandidateByEmailAsync(string email)
    {
        return await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);
    }


    // Update resume path
    public async Task UpdateResumePathAsync(Candidate candidate)
    {
        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync();
    }

    // Get candidate by ID
    public async Task<Candidate?> GetCandidateByIdAsync(int id)
    {
        return await _context.Candidates.FirstOrDefaultAsync(c => c.Id == id);
    }

    // Get interview assignments by candidate ID
    public async Task<List<InterviewAssignment>> GetAssignmentsByCandidateAsync(int candidateId)
    {
        return await _context.InterviewAssignments
            .Include(a => a.Interviewer)
            .Where(a => a.CandidateId == candidateId)
            .ToListAsync();
    }

}
