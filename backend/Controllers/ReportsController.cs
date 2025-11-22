using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportsController(IReportService service)
        {
            _service = service;
        }

        // GET => Rejected Candidates per Month
        [HttpGet("rejected")]
        public async Task<IActionResult> GetRejected(int year, int month)
        {
            return Ok(await _service.GetRejectedCandidatesByMonth(year, month));
        }

        // GET => Succeed Candidates per Month

        [HttpGet("success")]
        public async Task<IActionResult> GetSuccess(int year, int month)
        {
            return Ok(await _service.GetSuccessfulCandidatesByMonth(year, month));
        }


        // GET => Candidates who Rejected Proposal per Month
        [HttpGet("proposal-rejected")]
        public async Task<IActionResult> GetProposalRejected(int year, int month)
        {
            return Ok(await _service.GetProposalRejectedCandidatesByMonth(year, month));
        }


        // GET => Successful Candidates by Skill per Month
        [HttpGet("success-by-skill")]
        public async Task<IActionResult> GetSuccessBySkill(string skill, int year, int month)
        {
            return Ok(await _service.GetSuccessfulCandidatesBySkillAndMonth(skill, year, month));
        }
    }
}
