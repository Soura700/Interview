using backend.Interfaces;
using backend.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;
    private readonly IInterviewerAssignmentService _assignmentService;


    public CandidateController(
        ICandidateService candidateService,
        IInterviewerAssignmentService assignmentService)
    {
        _candidateService = candidateService;
        _assignmentService = assignmentService;
    }



    [HttpPost("create")]
    public async Task<IActionResult> Create(CreateCandidateDto dto)
    {
        try
        {
            var result = await _candidateService.CreateCandidateAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var (message, firstLogin) = await _candidateService.LoginAsync(dto);
        return Ok(new { message, firstLogin });
    }

    [HttpPost("changepassword")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var message = await _candidateService.ChangePasswordAsync(dto);
        return Ok(new { message });
    }

    [HttpPost("upload-resume")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadResume([FromForm] string email, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please upload a valid file.");

        // Optional validation — only PDF files allowed
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".pdf")
            return BadRequest("Only PDF files are allowed.");

        // Get candidate from DB
        var candidate = await _candidateService.GetCandidateByEmailAsync(email);
        if (candidate == null)
            return NotFound("Candidate not found.");


        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "resumes");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }


        candidate.ResumePath = $"/uploads/resumes/{uniqueFileName}";
        await _candidateService.UpdateResumePathAsync(candidate);

        return Ok(new
        {
            message = "Resume uploaded successfully.",
            resumePath = candidate.ResumePath
        });
    }

}
