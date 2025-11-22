using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/candidate/secure")]
    [Authorize(AuthenticationSchemes = "CandidateScheme", Roles = "Candidate")]
    public class CandidateSecureController : ControllerBase
    {
        private readonly IInterviewerAssignmentService _assignmentService;
        private readonly ICandidateService _candidateService;


        public CandidateSecureController(IInterviewerAssignmentService assignmentService, ICandidateService candidateService)
        {
            _assignmentService = assignmentService;
            _candidateService = candidateService;
        }

        // Check if candidate is authenticated
        [HttpGet("check")]
        public IActionResult CheckCandidate()
        {
            return Ok(new { authenticated = true });
        }


        // 🔥 Fetch all interviews grouped by status
        [HttpGet("interviews")]
        public async Task<IActionResult> GetInterviewDetails()
        {
            // Log full user claims
            // Console.WriteLine("CandidateSecureController Claims:");
            foreach (var c in User.Claims)
                Console.WriteLine($" - {c.Type}: {c.Value}");

            if (!User.Identity.IsAuthenticated)
                return Unauthorized("Candidate not authenticated");

            var idClaim = User.FindFirst("id")?.Value;
            Console.WriteLine("Candidate ID from JWT = " + idClaim);

            if (idClaim == null)
                return Unauthorized("Candidate ID missing in token");

            var candidateId = int.Parse(idClaim);

            var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

            // Console.WriteLine("Total Assignments for candidate: " + assignments.Count);

            var response = new
            {
                upcoming = assignments.Where(a =>
                    (a.Status == "Pending" || a.Status == "Accepted")
                // &&
                // a.ScheduledDate >= DateTime.UtcNow
                ).ToList(),

                accepted = assignments.Where(a => a.Status == "Accepted").ToList(),
                rejected = assignments.Where(a => a.Status == "Rejected").ToList(),
                completed = assignments.Where(a => a.Status == "Completed").ToList()
            };

            return Ok(response);
        }


        // 
        // 
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Ensure user authenticated
            if (!User.Identity.IsAuthenticated)
                return Unauthorized("Candidate not authenticated");

            // Extract ID from JWT
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Missing candidate ID in token");

            int candidateId = int.Parse(idClaim);

            // Get candidate from DB
            var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
                return NotFound("Candidate not found");

            // Prepare response
            return Ok(new
            {
                fullName = candidate.FullName,
                email = candidate.Email,
                experienceYears = candidate.ExperienceYears,
                skillSet = candidate.SkillSet,
                resumePath = candidate.ResumePath,
                firstLogin = candidate.FirstLogin
            });
        }

        [HttpPost("upload-resume")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload a valid file.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".pdf")
                return BadRequest("Only PDF files are allowed.");

            // Get Candidate ID from JWT Token
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Candidate ID missing in token.");

            int candidateId = int.Parse(idClaim);

            // Fetch candidate by ID
            var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
                return NotFound("Candidate not found.");

            // Save PDF
            var uploadsFolder = Path.Combine("wwwroot", "uploads", "resumes");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update DB
            candidate.ResumePath = $"/uploads/resumes/{uniqueFileName}";
            await _candidateService.UpdateResumePathAsync(candidate);

            return Ok(new
            {
                message = "Resume uploaded successfully.",
                resumePath = candidate.ResumePath
            });
        }

        //interview-status update in candidate portal
        // [HttpGet("assignment/schedule")]
        // public async Task<IActionResult> GetCandidateSchedule()
        // {
        //     // Ensure user authenticated
        //     if (!User.Identity.IsAuthenticated)
        //         return Unauthorized("Candidate not authenticated");

        //     // Extract candidate ID from JWT
        //     var idClaim = User.FindFirst("id")?.Value;
        //     if (idClaim == null)
        //         return Unauthorized("Candidate ID missing in token");

        //     int candidateId = int.Parse(idClaim);

        //     // Fetch assignments
        //     var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

        //     if (assignments == null || !assignments.Any())
        //         return NotFound(new { Message = "No interview scheduled." });

        //     return Ok(assignments);
        // }

        [HttpGet("assignment/schedule")]
        public async Task<IActionResult> GetSchedule()
        {
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Candidate ID missing");

            int candidateId = int.Parse(idClaim);

            var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

            var result = assignments.Select(a => new
            {
                id = a.Id,
                interviewer = a.Interviewer,
                scheduledDate = a.ScheduledDate,
                interviewType = a.InterviewType,
                status = a.Status,
                interviewerStatus = a.InterviewerStatus,
                remarks = a.Remarks,
                meetingLink = a.MeetingLink,
                offerStatus = a.OfferStatus,
                offerLetterSend = a.OfferLetterSend   // <-- ADD THIS!!!
            });

            return Ok(result);
        }


        //accept offer letter by candidate
        [HttpPut("assignment/offer")]
        public async Task<IActionResult> UpdateOfferStatus([FromQuery] int offerStatus)
        {
            // Ensure user authenticated
            if (!User.Identity.IsAuthenticated)
                return Unauthorized("Candidate not authenticated");

            // Read candidateId from JWT
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Candidate ID missing in token");

            int candidateId = int.Parse(idClaim);

            // Fetch the candidate’s assignment
            var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

            // Find ONLY hired assignment
            var message = await _assignmentService.UpdateOfferStatusAsync(candidateId, offerStatus);

            return Ok(new { Message = message });
        }
    }
}
