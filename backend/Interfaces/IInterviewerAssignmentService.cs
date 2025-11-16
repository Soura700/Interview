using backend.Models;

namespace backend.Interfaces
{
    public interface IInterviewerAssignmentService
    {
        // Fetch all assigned interviews for this interviewer
        Task<List<InterviewAssignment>> GetAssignmentsByInterviewerAsync(int interviewerId);

        // Interviewer accepts or rejects interview
        Task<string> UpdateAssignmentStatusAsync(int assignmentId, string status, string? remarks = null);

        Task<List<InterviewAssignment>> GetAssignmentsByCandidateAsync(int candidateId);

        Task<List<InterviewAssignment>> GetPendingAssignmentsForInterviewer(int interviewerId);


    }
}
