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

        public InterviewerAssignmentService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        //Get all assignments for this interviewer
        public async Task<List<InterviewAssignment>> GetAssignmentsByInterviewerAsync(int interviewerId)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Where(a => a.InterviewerId == interviewerId)
                .ToListAsync();
        }

        //Update assignment status (Accept / Reject)
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
                {
                    interviewer.IsAvailable = false;
                    interviewer.AvailabilityStatus = "Booked";
                }

                // NEW — Update candidate interview status
                var candidate = await _context.Candidates.FindAsync(assignment.CandidateId);
                if (candidate != null)
                {
                    candidate.InterviewStatus = "Booked";
                }
            }

            // If rejected — mark interviewer available again
            if (interviewerStatus == "Rejected")
            {
                var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
                if (interviewer != null)
                {
                    interviewer.IsAvailable = true;
                    interviewer.AvailabilityStatus = "Free";
                }

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

        // UPCOMING Interviews (Pending or Accepted & in future)
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

        // COMPLETED Interviews
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

        // REJECTED Interviews
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

        // public async Task<string> UpdateInterviewResultAsync(
        //     int assignmentId,
        //     string status,
        //     string? remarks = null)
        // {
        //     var assignment = await _context.InterviewAssignments.FindAsync(assignmentId);
        //     if (assignment == null)
        //         return "Assignment not found.";

        //     assignment.Status = status;
        //     assignment.Remarks = remarks;


        //     await _context.SaveChangesAsync();
        //     return "Interview result updated.";
        // }

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

            //  NEW → Update candidate interview status
            var candidates = await _context.Candidates.FindAsync(assignment.CandidateId);
            if (candidates != null)
            {
                candidates.InterviewStatus = "Completed";

                // NEW: If candidate is rejected, update candidate Status field
                if (status == "Rejected")
                {
                    candidates.Status = "Rejected";
                }


            }

            // Update interviewer availability after interview ends
            var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
            if (interviewer != null)
            {
                interviewer.IsAvailable = true;            // interviewer is free now
                interviewer.AvailabilityStatus = "Free";   // Free for next interview
            }

            // -------- Email Sending Logic Based on Result --------
            try
            {
                var candidate = await _context.Candidates.FindAsync(assignment.CandidateId);

                if (candidate != null && !string.IsNullOrWhiteSpace(candidate.Email))
                {
                    string subject = "";
                    string body = "";

                    if (status == "Hired")
                    {
                        subject = "🎉 Congratulations! You Are Hired";
                        body =
                            $"Hi {candidate.FullName},\n\n" +
                            $"Great news! You have been Hired based on your interview performance.\n\n" +
                            $"Remarks: {remarks}\n\n" +
                            $"Our HR team will reach out to you with onboarding details.\n\n" +
                            $"Warm congratulations!\n\n" +
                            $"Regards,\nInterview Management System";
                    }
                    else if (status == "Rejected")
                    {
                        subject = "Interview Result – Not Selected";
                        body =
                            $"Hi {candidate.FullName},\n\n" +
                            $"Thank you for interviewing with us.\n\n" +
                            $"Unfortunately, you were not selected this time.\n\n" +
                            $"Remarks: {remarks}\n\n" +
                            $"We encourage you to apply again for future opportunities.\n\n" +
                            $"Regards,\nInterview Management System";
                    }

                    if (!string.IsNullOrEmpty(subject))
                        await _emailService.SendEmailAsync(candidate.Email, subject, body);
                }
            }
            catch
            {
                // Silent catch to avoid breaking logic
            }

            // ---------------- Save DB ----------------
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

        public async Task<string> UpdateOfferStatusAsync(int candidateId, int offerStatus)
        {
            // find assignment for candidate
            var assignment = await _context.InterviewAssignments
                .Where(a => a.CandidateId == candidateId
                            && a.Status == "Hired")
                .FirstOrDefaultAsync();

            if (assignment == null)
                return "No hired candidate assignment found.";

            // Save offer status (1 = accepted, 0 = rejected)
            assignment.OfferStatus = offerStatus;

            await _context.SaveChangesAsync();

            return offerStatus == 1
                ? "Offer accepted successfully."
                : "Offer rejected successfully.";
        }


    }
}
