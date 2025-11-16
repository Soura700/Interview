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

        // 🔹 UPCOMING Interviews (Pending or Accepted & in future)
        public async Task<List<InterviewAssignment>> GetUpcomingInterviewsAsync(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a =>
                    a.InterviewerId == interviewerId &&
                    (a.Status == "Pending" || a.Status == "Accepted") &&
                    a.ScheduledDate >= DateTime.UtcNow
                )
                .OrderBy(a => a.ScheduledDate)
                .ToListAsync();
        }

        // 🔹 COMPLETED Interviews
        public async Task<List<InterviewAssignment>> GetCompletedInterviewsAsync(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a =>
                    a.InterviewerId == interviewerId &&
                    a.Status == "Completed"
                )
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();
        }

        // 🔹 REJECTED Interviews
        public async Task<List<InterviewAssignment>> GetRejectedInterviewsAsync(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a =>
                    a.InterviewerId == interviewerId &&
                    a.Status == "Rejected"
                )
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();
        }



        public async Task<List<InterviewAssignment>> GetAssignmentsByCandidateAsync(int candidateId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Interviewer)
                .Where(a => a.CandidateId == candidateId)
                .ToListAsync();
        }

        public async Task<List<InterviewAssignment>> GetPendingAssignmentsForInterviewer(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a => a.InterviewerId == interviewerId
                            && a.InterviewerStatus == "Pending")
                .ToListAsync();
        }


        public async Task<string> InterviewerAcceptAsync(int id, DateTime date)
        {
            var a = await _context.InterviewAssignments.FindAsync(id);
            if (a == null) return "Not found";

            if (a.InterviewerStatus != "Pending")
                return "Already processed";

            a.InterviewerStatus = "Accepted";
            a.ScheduledDate = date;

            var interviewer = await _context.Interviewers.FindAsync(a.InterviewerId);
            if (interviewer != null)
                interviewer.IsAvailable = false;

            await _context.SaveChangesAsync();
            return "Interview accepted.";
        }

        public async Task<string> InterviewerRejectAsync(int id)
        {
            var a = await _context.InterviewAssignments.FindAsync(id);
            if (a == null) return "Not found";

            if (a.InterviewerStatus != "Pending")
                return "Already processed";

            a.InterviewerStatus = "Rejected";

            var interviewer = await _context.Interviewers.FindAsync(a.InterviewerId);
            if (interviewer != null)
                interviewer.IsAvailable = true;

            await _context.SaveChangesAsync();
            return "Interview rejected.";
        }
    }
}
