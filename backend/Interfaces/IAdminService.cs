using backend.DTO;
using backend.Models;

namespace backend.Interfaces
{
    public interface IAdminService
    {
        Task<CandidateInterviewerMatchDto> GetCandidateWithMatchingInterviewersAsync(int candidateId, string interviewLevel);
        Task<InterviewAssignment> CreateAssignmentAsync(CreateAssignmentDto dto);
        Task<List<InterviewAssignment>> GetAllAssignmentsAsync();
        Task<string> CancelAssignmentAsync(int assignmentId);

        //  method for Use Case 5 (Search Interview Results)
        Task<List<InterviewAssignment>> SearchInterviewsByStatusAsync(string status);

        // Search Interviewer Availability
        Task<List<Interviewer>> SearchAvailableInterviewersAsync(string skill, string interviewLevel);

    }
}