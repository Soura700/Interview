// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;

// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;

// namespace backend.Controllers
// {
//     [ApiController]
//     [Route("api/candidate/secure")]
//     [Authorize(AuthenticationSchemes = "CandidateScheme", Roles = "Candidate")]
//     public class CandidateSecureController : ControllerBase
//     {
//         [HttpGet("check")]
//         public IActionResult CheckCandidate()
//         {
//             return Ok(new { authenticated = true });
//         }

//         [HttpGet("interviews")]
//         public async Task<IActionResult> GetInterviewDetails()
//         {
//             // Get candidate ID from the JWT token
//             var candidateId = int.Parse(User.FindFirst("id")!.Value);

//             var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

//             var response = new
//             {
//                 upcoming = assignments.Where(a =>
//                     (a.Status == "Pending" || a.Status == "Accepted") &&
//                     a.ScheduledDate >= DateTime.UtcNow
//                 ),

//                 accepted = assignments.Where(a => a.Status == "Accepted"),

//                 rejected = assignments.Where(a => a.Status == "Rejected"),

//                 completed = assignments.Where(a => a.Status == "Completed")
//             };

//             return Ok(response);
//         }
//     }

// }


// // namespace backend.Controllers
// // {
// //     [ApiController]
// //     [Route("api/candidate/secure")]
// //     [Authorize(AuthenticationSchemes = "CandidateScheme", Roles = "Candidate")]
// //     // [Authorize(Roles = "Candidate")]   // JWT Role Check
// //     public class CandidateSecureController : ControllerBase
// //     {
// //         [HttpGet("profile")]

// //         public IActionResult CheckAdmin()
// //         {
// //             return Ok(new { authenticated = true });
// //         }
// //         // public IActionResult GetProfile()
// //         // {
// //         //     return Ok(new { message = "Candidate authenticated", success = true });
// //         // }
// //     }
// // }


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

        // 🔐 Check if candidate is authenticated
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
            Console.WriteLine("🔍 CandidateSecureController Claims:");
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

            Console.WriteLine("🔍 Total Assignments for candidate: " + assignments.Count);

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
        // 
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // 🔍 Ensure user authenticated
            if (!User.Identity.IsAuthenticated)
                return Unauthorized("Candidate not authenticated");

            // 🔍 Extract ID from JWT
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Missing candidate ID in token");

            int candidateId = int.Parse(idClaim);

            // 🔍 Get candidate from DB
            var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
                return NotFound("Candidate not found");

            // 🔥 Prepare response
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

            // ✅ Get Candidate ID from JWT Token
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
        [HttpGet("assignment/schedule")]
        public async Task<IActionResult> GetCandidateSchedule()
        {
            // Ensure user authenticated
            if (!User.Identity.IsAuthenticated)
                return Unauthorized("Candidate not authenticated");

            // Extract candidate ID from JWT
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Candidate ID missing in token");

            int candidateId = int.Parse(idClaim);

            // Fetch assignments
            var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

            if (assignments == null || !assignments.Any())
                return NotFound(new { Message = "No interview scheduled." });

            return Ok(assignments);
        }

        //accept offer letter by candidate
        [HttpPut("assignment/offer")]
        public async Task<IActionResult> UpdateOfferStatus([FromQuery] int offerStatus)
        {
            // 1️⃣ Ensure user authenticated
            if (!User.Identity.IsAuthenticated)
                return Unauthorized("Candidate not authenticated");

            // 2️⃣ Read candidateId from JWT
            var idClaim = User.FindFirst("id")?.Value;
            if (idClaim == null)
                return Unauthorized("Candidate ID missing in token");

            int candidateId = int.Parse(idClaim);

            // 3️⃣ Fetch the candidate’s assignment
            var assignments = await _assignmentService.GetAssignmentsByCandidateAsync(candidateId);

            // Find ONLY hired assignment
            var message = await _assignmentService.UpdateOfferStatusAsync(candidateId, offerStatus);

            return Ok(new { Message = message });
        }



    }
}
