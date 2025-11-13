using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoMeetingController : ControllerBase
    {
        private readonly IVideoMeetingService _service;

        public VideoMeetingController(IVideoMeetingService service)
        {
            _service = service;
        }

        // POST /api/VideoMeeting/create/5
        [HttpPost("create/{assignmentId}")]
        public async Task<IActionResult> Create(int assignmentId)
        {
            try
            {
                var link = await _service.CreateMeetingLinkForAssignmentAsync(assignmentId);
                return Ok(new { meetingLink = link });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET /api/VideoMeeting/{assignmentId}
        [HttpGet("{assignmentId}")]
        public async Task<IActionResult> Get(int assignmentId)
        {
            var meeting = await _service.GetAssignmentWithMeetingAsync(assignmentId);
            if (meeting == null) return NotFound();
            return Ok(meeting);
        }
    }
}
    