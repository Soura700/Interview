using backend.Data;
using backend.DTO;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        // Match Candidate with Interviewers (Skill & Level)
        public async Task<CandidateInterviewerMatchDto> GetCandidateWithMatchingInterviewersAsync(int candidateId, string interviewLevel)
        {
            var candidate = await _context.Candidates.FindAsync(candidateId);
            if (candidate == null)
                throw new Exception("Candidate not found.");

            // Check candidate availability
            if(candidate.InterviewStatus != "None"){
                throw new Exception("Candidate already has an assigned or pending interview.");
            }

            // Extract candidate skills
            var candidateSkills = (candidate.SkillSet ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s => s.ToLowerInvariant())
                .ToList();

            // Get all free and available interviewers of given level
            var interviewers = await _context.Interviewers
                .Where(i => i.InterviewLevel == interviewLevel 
                && i.IsAvailable && i.AvailabilityStatus == "Free")
                .ToListAsync();

            // Match interviewers based on common skills
            var matchedInterviewers = interviewers
                .Where(i =>
                {
                    var interviewerSkills = (i.SkillSet ?? "")
                        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                        .Select(s => s.ToLowerInvariant());
                    return interviewerSkills.Any(skill => candidateSkills.Contains(skill));
                })
                .Select(i => new InterviewerDto
                {
                    Id = i.Id,
                    FullName = i.FullName,
                    Email = i.Email,
                    SkillSet = i.SkillSet,
                    InterviewLevel = i.InterviewLevel,
                    ExperienceYears = i.ExperienceYears,
                    IsAvailable = i.IsAvailable
                })
                .ToList();

            // Build candidate DTO
            var candidateDto = new CandidateDto
            {
                Id = candidate.Id,
                FullName = candidate.FullName,
                Email = candidate.Email,
                SkillSet = candidate.SkillSet,
                ExperienceYears = candidate.ExperienceYears,
                ResumePath = candidate.ResumePath
            };

            return new CandidateInterviewerMatchDto
            {
                Candidate = candidateDto,
                SuggestedInterviewers = matchedInterviewers
            };
        }

        //Create Interview Assignment (Admin assigns candidate → interviewer)
        // public async Task<InterviewAssignment> CreateAssignmentAsync(CreateAssignmentDto dto)
        // {
        //     var interviewer = await _context.Interviewers.FindAsync(dto.InterviewerId);
        //     var candidate = await _context.Candidates.FindAsync(dto.CandidateId);

        //     if (interviewer == null || candidate == null)
        //         throw new Exception("Invalid interviewer or candidate ID.");

        //     // Create the new assignment
        //     var assignment = new InterviewAssignment
        //     {
        //         InterviewerId = dto.InterviewerId,
        //         CandidateId = dto.CandidateId,
        //         InterviewType = dto.InterviewType,
        //         ScheduledDate = dto.ScheduledDate,
        //         Status = "Pending" // interviewer will later accept/reject
        //     };

        //     _context.InterviewAssignments.Add(assignment);
        //     await _context.SaveChangesAsync();

        //     return assignment;
        // }

        public async Task<InterviewAssignment> CreateAssignmentAsync(CreateAssignmentDto dto)
        {
            var interviewer = await _context.Interviewers.FindAsync(dto.InterviewerId);
            var candidate = await _context.Candidates.FindAsync(dto.CandidateId);

            if (interviewer == null || candidate == null)
                throw new Exception("Invalid interviewer or candidate ID.");

            // Create the new assignment
            var assignment = new InterviewAssignment
            {
                InterviewerId = dto.InterviewerId,
                CandidateId = dto.CandidateId,
                InterviewType = dto.InterviewType,
                ScheduledDate = dto.ScheduledDate,
                Status = "Pending" // interviewer will later accept/reject
            };

            // Add assignment
            _context.InterviewAssignments.Add(assignment);

            // UPDATE INTERVIEWER AVAILABILITY
            interviewer.AvailabilityStatus = "Pending";
            // Values: Free → Pending → Booked

            // UPDATE CANDIDATE STATUS
            candidate.InterviewStatus = "Pending";
            // Values: None → Pending → Booked / Completed

            // Save changes
            await _context.SaveChangesAsync();

            return assignment;
        }


        // Cancel Assignment (Admin)
        public async Task<string> CancelAssignmentAsync(int assignmentId)
        {
            var assignment = await _context.InterviewAssignments.FindAsync(assignmentId);
            if (assignment == null)
                return "Assignment not found.";

            assignment.Status = "Cancelled";

            // Make interviewer available again
            var interviewer = await _context.Interviewers.FindAsync(assignment.InterviewerId);
            if (interviewer != null)
                interviewer.IsAvailable = true;

            await _context.SaveChangesAsync();
            return "Assignment cancelled successfully.";
        }

        //Get All Assignments (Admin Dashboard)
        public async Task<List<InterviewAssignment>> GetAllAssignmentsAsync()
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Include(a => a.Interviewer)
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();
        }


        // Search Interview Results by Status (Admin)


        public async Task<List<InterviewAssignment>> SearchInterviewsByStatusAsync(string status)
        {
            return await _context.InterviewAssignments
                .Include(a => a.Candidate)
                .Include(a => a.Interviewer)
                .Where(a => a.Status.ToLower() == status.ToLower())
                .OrderByDescending(a => a.ScheduledDate)
                .ToListAsync();
        }

        // Search Interviewer Availability

        public async Task<List<Interviewer>> SearchAvailableInterviewersAsync(string skill, string interviewLevel)
        {
            return await _context.Interviewers
                .Where(i =>
                    i.AvailabilityStatus == "Free" &&
                    i.IsAvailable &&
                    i.InterviewLevel.ToLower() == interviewLevel.ToLower() &&
                    i.SkillSet.ToLower().Contains(skill.ToLower()))
                .ToListAsync();
        }

    }
}
