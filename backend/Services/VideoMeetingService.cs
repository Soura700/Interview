using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class VideoMeetingService : IVideoMeetingService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public VideoMeetingService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<string> CreateMeetingLinkForAssignmentAsync(int assignmentId)
    {
        var assignment = await _context.InterviewAssignments.FindAsync(assignmentId);
        if (assignment == null) throw new Exception("Assignment not found.");

        if (string.IsNullOrWhiteSpace(assignment.MeetingId))
        {
            assignment.MeetingId = Guid.NewGuid().ToString();
            var frontendBase = _configuration.GetValue<string>("FrontendBaseUrl") ?? "https://localhost:4200/meeting";
            assignment.MeetingLink = $"{frontendBase}/{assignment.MeetingId}";
            _context.Update(assignment);
            await _context.SaveChangesAsync();
        }

        return assignment.MeetingLink;
    }

    public async Task<InterviewAssignment?> GetAssignmentWithMeetingAsync(int assignmentId)
    {
        return await _context.InterviewAssignments
            .Include(a => a.Candidate)
            .Include(a => a.Interviewer)
            .FirstOrDefaultAsync(a => a.Id == assignmentId);
    }
}
