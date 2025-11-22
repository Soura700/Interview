using backend.Data;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class OfferLetterService : IOfferLetterService
    {
        private readonly AppDbContext _context;

        public OfferLetterService(AppDbContext context)
        {
            _context = context;
        }

        // Called when admin sends offer letter
        public async Task<bool> MarkOfferLetterSentAsync(int candidateId)
        {
            var assignment = await _context.InterviewAssignments
                .Where(a => a.CandidateId == candidateId && a.Status == "Hired")
                .FirstOrDefaultAsync();

            if (assignment == null)
                return false;

            assignment.OfferLetterSend = 1;    // mark as sent

            await _context.SaveChangesAsync();
            return true;
        }

        // Called when candidate accepts / rejects
        public async Task<bool> UpdateOfferAcceptanceAsync(int candidateId, int offerStatus)
        {
            var assignment = await _context.InterviewAssignments
                .Where(a => a.CandidateId == candidateId && a.Status == "Hired")
                .FirstOrDefaultAsync();

            if (assignment == null)
                return false;

            assignment.OfferStatus = offerStatus;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
