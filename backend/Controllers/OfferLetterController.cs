// using backend.Services;
// using backend.Interfaces;
// using backend.Data;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace backend.Controllers
// {
//     [ApiController]
//     [Route("api/admin/offer-letter")]
//     public class OfferLetterController : ControllerBase
//     {
//         private readonly PdfService _pdfService;
//         private readonly ICandidateService _candidateService;
//         private readonly AppDbContext _context;
//         private readonly IEmailService _emailService;

//         public OfferLetterController(
//             PdfService pdfService,
//             ICandidateService candidateService,
//             AppDbContext context,
//             IEmailService emailService)
//         {
//             _pdfService = pdfService;
//             _candidateService = candidateService;
//             _context = context;
//             _emailService = emailService;
//         }

//         [HttpGet("{candidateId}")]
//         public async Task<IActionResult> GenerateOfferLetter(int candidateId)
//         {
//             var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
//             if (candidate == null)
//                 return NotFound(new { message = "Candidate not found" });

//             var assignment = await _context.InterviewAssignments
//                 .Where(a => a.CandidateId == candidateId)
//                 .OrderByDescending(a => a.Id)
//                 .FirstOrDefaultAsync();

//             if (assignment == null)
//                 return BadRequest(new { message = "No interview record found" });

//             if (assignment.Status != "Hired")
//                 return BadRequest(new { message = "Candidate is not hired yet." });

//             var pdfBytes = _pdfService.GenerateOfferLetter(candidate.FullName, candidate.Email);

//             return File(pdfBytes, "application/pdf", $"{candidate.FullName}_OfferLetter.pdf");
//         }

//         [HttpPost("send/{candidateId}")]
//         public async Task<IActionResult> SendOfferLetter(int candidateId)
//         {
//             var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
//             if (candidate == null)
//                 return NotFound(new { message = "Candidate not found" });

//             var assignment = await _context.InterviewAssignments
//                 .Where(a => a.CandidateId == candidateId)
//                 .OrderByDescending(a => a.Id)
//                 .FirstOrDefaultAsync();

//             if (assignment == null)
//                 return BadRequest(new { message = "No interview record found" });

//             if (assignment.Status != "Hired")
//                 return BadRequest(new { message = "Cannot send offer letter. Candidate is not hired." });

//             var pdfBytes = _pdfService.GenerateOfferLetter(candidate.FullName, candidate.Email);

//             string subject = "🎉 Your Official Offer Letter";
//             string body =
//                 $"Dear {candidate.FullName},\n\n" +
//                 "Congratulations! You have been selected to join our organization.\n\n" +
//                 "Your official Offer Letter is attached to this email.\n" +
//                 "Our HR team will reach out soon with the next steps.\n\n" +
//                 "Warm Regards,\nHR Team";

//             await _emailService.SendEmailWithAttachmentAsync(
//                 candidate.Email,
//                 subject,
//                 body,
//                 pdfBytes,
//                 $"{candidate.FullName}_OfferLetter.pdf"
//             );

//             return Ok(new { message = "Offer letter emailed successfully!" });
//         }
//     }
// }


using backend.Services;
using backend.Interfaces;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin/offer-letter")]
    public class OfferLetterController : ControllerBase
    {
        private readonly PdfService _pdfService;
        private readonly ICandidateService _candidateService;
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IOfferLetterService _offerLetterService;

        public OfferLetterController(
            PdfService pdfService,
            ICandidateService candidateService,
            AppDbContext context,
            IEmailService emailService,
            IOfferLetterService offerLetterService
        )
        {
            _pdfService = pdfService;
            _candidateService = candidateService;
            _context = context;
            _emailService = emailService;
            _offerLetterService = offerLetterService;
        }

        // --------------------------------------------------------
        // DOWNLOAD OFFER LETTER PDF
        // --------------------------------------------------------
        [HttpGet("{candidateId}")]
        public async Task<IActionResult> GenerateOfferLetter(int candidateId)
        {
            var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
                return NotFound(new { message = "Candidate not found" });

            var assignment = await _context.InterviewAssignments
                .Where(a => a.CandidateId == candidateId)
                .OrderByDescending(a => a.Id)
                .FirstOrDefaultAsync();

            if (assignment == null)
                return BadRequest(new { message = "No interview record found" });

            if (assignment.Status != "Hired")
                return BadRequest(new { message = "Candidate is not hired yet." });

            var pdfBytes = _pdfService.GenerateOfferLetter(candidate.FullName, candidate.Email);

            return File(pdfBytes, "application/pdf", $"{candidate.FullName}_OfferLetter.pdf");
        }

        // --------------------------------------------------------
        // SEND OFFER LETTER BY EMAIL + UPDATE STATUS
        // --------------------------------------------------------
        // [HttpPost("send/{candidateId}")]
        // public async Task<IActionResult> SendOfferLetter(int candidateId)
        // {
        //     var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
        //     if (candidate == null)
        //         return NotFound(new { message = "Candidate not found" });

        //     var assignment = await _context.InterviewAssignments
        //         .Where(a => a.CandidateId == candidateId)
        //         .OrderByDescending(a => a.Id)
        //         .FirstOrDefaultAsync();

        //     if (assignment == null)
        //         return BadRequest(new { message = "No interview record found" });

        //     if (assignment.Status != "Hired")
        //         return BadRequest(new { message = "Cannot send offer letter. Candidate is not hired." });

        //     var pdfBytes = _pdfService.GenerateOfferLetter(candidate.FullName, candidate.Email);

        //     string subject = "🎉 Your Official Offer Letter";
        //     string body =
        //         $"Dear {candidate.FullName},\n\n" +
        //         "Congratulations! You have been selected to join our organization.\n\n" +
        //         "Your official Offer Letter is attached to this email.\n" +
        //         "Our HR team will reach out soon with the next steps.\n\n" +
        //         "Warm Regards,\nHR Team";

        //     await _emailService.SendEmailWithAttachmentAsync(
        //         candidate.Email,
        //         subject,
        //         body,
        //         pdfBytes,
        //         $"{candidate.FullName}_OfferLetter.pdf"
        //     );

        //     // MARK OFFER LETTER AS SENT
        //     await _offerLetterService.MarkOfferLetterSentAsync(candidateId);

        //     return Ok(new { message = "Offer letter emailed successfully!" });
        // }

        [HttpPost("send/{candidateId}")]
        public async Task<IActionResult> SendOfferLetter(int candidateId)
        {
            var candidate = await _candidateService.GetCandidateByIdAsync(candidateId);
            if (candidate == null)
                return NotFound(new { message = "Candidate not found" });

            var assignment = await _context.InterviewAssignments
                .Where(a => a.CandidateId == candidateId)
                .OrderByDescending(a => a.Id)
                .FirstOrDefaultAsync();

            if (assignment == null)
                return BadRequest(new { message = "No interview record found" });

            if (assignment.Status != "Hired")
                return BadRequest(new { message = "Cannot send offer letter. Candidate is not hired." });

            // SEND EMAIL
            var pdfBytes = _pdfService.GenerateOfferLetter(candidate.FullName, candidate.Email);

            await _emailService.SendEmailWithAttachmentAsync(
                candidate.Email,
                "🎉 Your Official Offer Letter",
                $"Dear {candidate.FullName},\n\nYour official offer letter is attached.\n\nRegards,\nHR Team",
                pdfBytes,
                $"{candidate.FullName}_OfferLetter.pdf"
            );

            // ⭐ UPDATE OFFER SENT FLAG
            assignment.OfferLetterSend = 1;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Offer letter emailed successfully!" });
        }

    }
}