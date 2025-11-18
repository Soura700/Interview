using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class InterviewerAssignmentService : IInterviewerAssignmentService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public InterviewerAssignmentService(AppDbContext context,IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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
        public async Task<string> UpdateAssignmentStatusAsync(int assignmentId, string interviewerStatus, DateTime? scheduledDate = null, string? remarks = null)
        {
            var assignment = await _context.InterviewAssignments.FindAsync(assignmentId);
            if (assignment == null)
                return "Assignment not found.";

            // Only allow update if pending
            if (assignment.InterviewerStatus != "Pending")
                return "Only pending assignments can be updated.";

            assignment.InterviewerStatus = interviewerStatus;

            if (interviewerStatus == "Accepted" && scheduledDate.HasValue)
            {
                assignment.ScheduledDate = scheduledDate.Value;

                var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
                if (interviewer != null)
                    interviewer.IsAvailable = false;
            }

            // If rejected — mark interviewer available again
            if (interviewerStatus == "Rejected")
            {
                var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
                if (interviewer != null)
                    interviewer.IsAvailable = true;
            }

            // --- Email sending (added) ---
            // Only send emails when assignment was accepted AND a scheduled date is present.
            // This keeps behavior safe (no emails for simple status flips without a date).
            if (interviewerStatus == "Accepted")
            {

                // Console.writeLine("Preparing to send emails for accepted interview...");
                // check ScheduledDate presence; adjust check if ScheduledDate is nullable in your model
                var hasDate =
                    assignment.ScheduledDate != default(DateTime); // if ScheduledDate is DateTime
                                                                   // OR if ScheduledDate is nullable: assignment.ScheduledDate.HasValue

                if (hasDate)
                {
                    try
                    {
                        // load related entities for email content
                        var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
                        var candidate = await _context.Candidates.FindAsync(assignment.CandidateId);
                        //  var meetingLink = assignment.MeetingLink; //gives https
                        var meetingLink = assignment.MeetingLink?.Replace("https://", "http://");

                        var formattedDate = assignment.ScheduledDate.ToString("f"); // change format if needed

                        // Candidate email
                        if (candidate != null && !string.IsNullOrWhiteSpace(candidate.Email))
                        {
                            var candSubject = $"Interview Scheduled on {formattedDate}";
                            var candBody =
                                $"Hi {candidate.FullName},\n\n" +
                                $"Your interview has been scheduled.\n\n" +
                                $"Interviewer: {interviewer?.FullName}\n" +
                                $"Scheduled Date: {formattedDate}\n\n" +
                                 $"Meeting Link: {meetingLink}\n\n" +
                                "Please be available at the scheduled time.\n\n" +
                                "Regards,\nInterview Management System";

                            await _emailService.SendEmailAsync(candidate.Email, candSubject, candBody);
                        }

                        // Interviewer email (confirmation)
                        if (interviewer != null && !string.IsNullOrWhiteSpace(interviewer.Email))
                        {
                            var intvSubject = $"Interview Confirmed for {formattedDate}";
                            var intvBody =
                                $"Hi {interviewer.FullName},\n\n" +
                                $"You have confirmed the interview.\n\n" +
                                $"Candidate: {candidate?.FullName}\n" +
                                $"Scheduled Date: {formattedDate}\n\n" +


                                $"Meeting Link: {meetingLink}\n\n" +

                                "Thank you.\n\n" +
                                "Regards,\nInterview Management System";

                            await _emailService.SendEmailAsync(interviewer.Email, intvSubject, intvBody);
                        }
                    }
                    catch (Exception ex)
                    {
                        // Swallow the exception to keep the original DB behavior unchanged.
                        // But log it if you have a logger, e.g. _logger.LogError(ex, "Email send failed");
                    }
                }

            }
            await _context.SaveChangesAsync();
            return $"Interview {interviewerStatus} successfully.";
        }

        // 🔹 UPCOMING Interviews (Pending or Accepted & in future)
        public async Task<List<InterviewAssignment>> GetUpcomingInterviewsAsync(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a =>
                    a.InterviewerId == interviewerId &&
                    (a.InterviewerStatus == "Pending" || a.InterviewerStatus == "Accepted") &&
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
                    a.Status != "Pending"
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

        public async Task<string> UpdateInterviewResultAsync(
            int assignmentId,
            string status,
            string? remarks = null)
        {
            var assignment = await _context.InterviewAssignments.FindAsync(assignmentId);
            if (assignment == null)
                return "Assignment not found.";

            assignment.Status = status;
            assignment.Remarks = remarks;


            await _context.SaveChangesAsync();
            return "Interview result updated.";
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
