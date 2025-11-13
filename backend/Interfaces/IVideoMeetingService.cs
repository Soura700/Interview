using backend.Models;

namespace backend.Interfaces;

public interface IVideoMeetingService
{
    Task<string> CreateMeetingLinkForAssignmentAsync(int assignmentId);
    Task<InterviewAssignment?> GetAssignmentWithMeetingAsync(int assignmentId);
}
