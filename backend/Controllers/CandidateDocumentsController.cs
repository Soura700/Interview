using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Interfaces;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/candidate/documents")]
    public class CandidateDocumentsController : ControllerBase
    {
        private readonly PdfService _pdfService;
        private readonly ICandidateService _candidateService;

        public CandidateDocumentsController(PdfService pdfService, ICandidateService candidateService)
        {
            _pdfService = pdfService;
            _candidateService = candidateService;
        }

        [HttpGet("shortlist-letter/{candidateId}")]
        public async Task<IActionResult> GetShortlistLetter(int candidateId)
        {
            var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);

            if (candidate == null)
                return NotFound("Candidate not found");

            // 🔥 FIX — USING NEW METHOD
            var pdf = _pdfService.GenerateOfferLetter(candidate.FullName, candidate.Email);

            return File(pdf, "application/pdf", $"{candidate.FullName}_Shortlisted.pdf");
        }
    }
}