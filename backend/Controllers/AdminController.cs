using backend.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IVideoMeetingService _videoMeetingService;

        public AdminController(IAdminService adminService, IVideoMeetingService videoMeetingService)
        {
            _adminService = adminService;
            _videoMeetingService = videoMeetingService;
        }

        /// Get a candidate with all matching interviewers (based on skill, experience, and availability)
        /// Example: GET /api/admin/match-candidate/3?interviewLevel=L1

        [HttpGet("match-candidate/{candidateId}")]
        public async Task<IActionResult> MatchCandidateWithInterviewers(int candidateId, [FromQuery] string interviewLevel = "L1")
        {
            var result = await _adminService.GetCandidateWithMatchingInterviewersAsync(candidateId, interviewLevel);
            return Ok(result);
        }


        /// Create interview assignment (Admin assigns candidate to interviewer)
        // [HttpPost("assignments")]
        // public async Task<IActionResult> CreateAssignment(CreateAssignmentDto dto)
        // {
        //     var result = await _adminService.CreateAssignmentAsync(dto);
        //     return Ok(result);
        // }

        [HttpPost("assignments")]
        public async Task<IActionResult> CreateAssignment(CreateAssignmentDto dto)
        {
            try
            {
                // 1. Create the assignment (normal flow)
                var result = await _adminService.CreateAssignmentAsync(dto);

                // 2. Immediately generate the meeting link for that assignment
                var meetingLink = await _videoMeetingService.CreateMeetingLinkForAssignmentAsync(result.Id);
                result.MeetingLink = meetingLink; // store the link in result

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        ///View all interview assignments
        [HttpGet("assignments")]
        public async Task<IActionResult> GetAllAssignments()
        {
            var result = await _adminService.GetAllAssignmentsAsync();
            return Ok(result);
        }


        /// Cancel an interview assignment (Admin)
        [HttpPut("assignments/{id}/cancel")]
        public async Task<IActionResult> CancelAssignment(int id)
        {
            var message = await _adminService.CancelAssignmentAsync(id);
            return Ok(new { message });
        }



        [HttpGet("search/interviews")]
        public async Task<IActionResult> SearchInterviews([FromQuery] string status)
        {
            var results = await _adminService.SearchInterviewsByStatusAsync(status);
            if (results == null || !results.Any())
                return NotFound(new { Message = $"No interviews found with status '{status}'." });

            return Ok(results);
        }

        // Search Available Interviewers

        [HttpGet("search/interviewers")]
        public async Task<IActionResult> SearchAvailableInterviewers([FromQuery] string skill, [FromQuery] string interviewLevel)
        {
            var result = await _adminService.SearchAvailableInterviewersAsync(skill, interviewLevel);
            if (result == null || !result.Any())
                return NotFound(new { Message = $"No available interviewers found with skill '{skill}' and level '{interviewLevel}'." });

            return Ok(result);
        }

        //         [HttpPost("assignments")]
        // public async Task<IActionResult> CreateAssignment(CreateAssignmentDto dto)
        // {
        //     var result = await _adminService.CreateAssignmentAsync(dto);

        //     // ✅ Once created, auto-generate a meeting link
        //     var meetingLink = await _videoMeetingService.CreateMeetingLinkForAssignmentAsync(result.Id);

        //     // ✅ Reload the assignment with the new fields
        //     result.MeetingLink = meetingLink;

        //     return Ok(result);
        // }


    }
}
