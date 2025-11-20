using backend.DTO;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InterviewManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewerController : ControllerBase
    {
        private readonly IInterviewerService _service;
        private readonly IInterviewerAssignmentService _assignmentService;


        public InterviewerController(IInterviewerService service, IInterviewerAssignmentService assignmentService)
        {
            _service = service;
            _assignmentService = assignmentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateInterviewerDto dto)
        {
            try
            {
                var interviewer = await _service.CreateInterviewerAsync(dto);
                return Ok(new { message = "Interviewer created successfully.", interviewer });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var (message, firstLogin) = await _service.LoginAsync(dto);
            return Ok(new { Message = message, FirstLogin = firstLogin });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var message = await _service.ChangePasswordAsync(dto);
            return Ok(new { Message = message });
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllInterviewersAsync();
            return Ok(data);
        }

        /// Get all assigned interviews for this interviewer
        [HttpGet("assignments/{interviewerId}")]
        public async Task<IActionResult> GetAssignments(int interviewerId)
        {
            var result = await _assignmentService.GetAssignmentsByInterviewerAsync(interviewerId);
            if (result == null || !result.Any())
                return NotFound(new { Message = "No assignments found for this interviewer." });

            return Ok(result);
        }

        /// Accept or Reject interview assignment
        [HttpPut("assignments/{assignmentId}/status")]
        public async Task<IActionResult> UpdateAssignmentStatus(
           int assignmentId,
           [FromQuery] string interviewerStatus,
           [FromQuery] DateTime? scheduledDate = null,
           [FromQuery] string? remarks = null)
        {
            var message = await _assignmentService.UpdateAssignmentStatusAsync(assignmentId, interviewerStatus, scheduledDate, remarks);
            return Ok(new { Message = message });
        }

        //Interview result submission
        [HttpPut("assignments/{assignmentId}/result")]
        public async Task<IActionResult> UpdateInterviewResult(
            int assignmentId,
            [FromQuery] string status,
            [FromQuery] string? remarks = null)
        {
            var message = await _assignmentService.UpdateInterviewResultAsync(
                assignmentId,
                status,
                remarks
            );

            return Ok(new { Message = message });
        }

        [HttpGet("assignments/completed/{interviewerId}")]
        public async Task<IActionResult> GetCompletedInterviews(int interviewerId)
        {
            var result = await _assignmentService.GetCompletedInterviewsAsync(interviewerId);

            if (result == null || !result.Any())
                return NotFound(new { Message = "No completed interviews found." });

            return Ok(result);
        }

         [HttpGet("all-paged")]
         public async Task<IActionResult> GetAllInterviewers(int page = 1, int pageSize = 10)
         {
             var totalInterviewers = await _service.GetInterviewerCountAsync();
            // Auto-adjust page size
             if (totalInterviewers < pageSize)
                 pageSize = totalInterviewers;
            if (pageSize == 0)
                 pageSize = 1;
            var interviewers = await _service.GetAllInterviewersAsync(page, pageSize);
            return Ok(new
             {
                 total = totalInterviewers,
                 page,
                 pageSize,
                 interviewers
             });
         }



    }
}