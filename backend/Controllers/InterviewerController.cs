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
            var interviewer = await _service.CreateInterviewerAsync(dto);
            return Ok(new { Message = "Interviewer created successfully.", interviewer });
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
           [FromQuery] string status,
           [FromQuery] string? remarks = null)
        {
            var message = await _assignmentService.UpdateAssignmentStatusAsync(assignmentId, status, remarks);
            return Ok(new { Message = message });
        }
    }
}