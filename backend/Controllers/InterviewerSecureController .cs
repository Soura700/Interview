// using backend.Interfaces;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;

// namespace backend.Controllers
// {
//     [ApiController]
//     [Route("api/interviewer/secure")]
//     [Authorize(AuthenticationSchemes = "InterviewerScheme", Roles = "Interviewer")]
//     public class InterviewerSecureController : ControllerBase
//     {
//         private readonly IInterviewerAssignmentService _assignmentService;

//         public InterviewerSecureController(IInterviewerAssignmentService assignmentService)
//         {
//             _assignmentService = assignmentService;
//         }

//         [HttpGet("check")]
//         public IActionResult CheckInterviewer()
//         {
//             return Ok(new { authenticated = true });
//         }

//         // SHOW all assigned interviews where interviewerStatus = Pending
//         [HttpGet("assigned")]
//         public async Task<IActionResult> GetAssigned()
//         {
//             int interviewerId = int.Parse(User.FindFirst("id")!.Value);

//             var list = await _assignmentService.GetPendingAssignmentsForInterviewer(interviewerId);

//             return Ok(list);
//         }
//     }
// }



using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/interviewer/secure")]
    [Authorize(AuthenticationSchemes = "InterviewerScheme", Roles = "Interviewer")]
    public class InterviewerSecureController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IInterviewerAssignmentService _assignmentService;

        public InterviewerSecureController(
            IInterviewerAssignmentService assignmentService,
            AppDbContext context
        )
        {
            _assignmentService = assignmentService;
            _context = context;
        }

        // CHECK AUTH
        [HttpGet("check")]
        public IActionResult CheckInterviewer()
        {
            return Ok(new { authenticated = true });
        }

        // REQUIRED BY ANGULAR — FIXED
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var idClaim = User.FindFirst("id")?.Value;

            if (idClaim == null)
                return Unauthorized("Interviewer ID missing");

            int interviewerId = int.Parse(idClaim);

            var interviewer = await _context.Interviewers
                .FirstOrDefaultAsync(i => i.Id == interviewerId);

            if (interviewer == null)
                return NotFound("Interviewer not found");

            return Ok(new
            {
                id = interviewer.Id,
                email = interviewer.Email,
                fullName = interviewer.FullName,
                experienceYears = interviewer.ExperienceYears,
                skillSet = interviewer.SkillSet,
                interviewLevel = interviewer.InterviewLevel,
                firstLogin = interviewer.FirstLogin
            });
        }


        // Assigned Interviews
        [HttpGet("assigned")]
        public async Task<IActionResult> GetAssigned()
        {
            int interviewerId = int.Parse(User.FindFirst("id")!.Value);

            var list = await _assignmentService
                .GetPendingAssignmentsForInterviewer(interviewerId);

            return Ok(list);
        }
    }
}
