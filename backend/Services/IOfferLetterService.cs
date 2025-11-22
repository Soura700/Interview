using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IOfferLetterService
    {
        Task<bool> MarkOfferLetterSentAsync(int candidateId);
        Task<bool> UpdateOfferAcceptanceAsync(int candidateId, int offerStatus);
    }
}
