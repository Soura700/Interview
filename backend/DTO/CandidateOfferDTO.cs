namespace backend.DTO
{
    public class CandidateOfferDto
    {
        public int CandidateId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;   // Hired
        public string? Remarks { get; set; }
    }
}
