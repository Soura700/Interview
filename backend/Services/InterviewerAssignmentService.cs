using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class InterviewerAssignmentService : IInterviewerAssignmentService
    {
        private readonly AppDbContext _context;

        public InterviewerAssignmentService(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Get all assignments for this interviewer
        public async Task<List<InterviewAssignment>> GetAssignmentsByInterviewerAsync(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a => a.InterviewerId == interviewerId)
                .ToListAsync();
        }

        // 🔹 Update assignment status (Accept / Reject)
        public async Task<string> UpdateAssignmentStatusAsync(int assignmentId, string status, string? remarks = null)
        {
            var assignment = await _context.InterviewAssignments.FindAsync(assignmentId);
            if (assignment == null)
                return "Assignment not found.";

            // Only allow update if pending
            if (assignment.Status != "Pending")
                return "Only pending assignments can be updated.";

            if (status != "Accepted" && status != "Rejected")
                return "Invalid status. Use Accepted or Rejected.";

            assignment.Status = status;
            assignment.Remarks = remarks;

            // If rejected — mark interviewer available again
            if (status == "Rejected")
            {
                var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
                if (interviewer != null)
                    interviewer.IsAvailable = true;
            }

            await _context.SaveChangesAsync();
            return $"Interview {status} successfully.";
        }
    }
}
