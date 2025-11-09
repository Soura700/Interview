namespace backend.DTO
{
    public class CreateAssignmentDto
    {
        public int InterviewerId { get; set; }
        public int CandidateId { get; set; }
        public string InterviewType { get; set; } = string.Empty; // "L1" or "L2"
        public DateTime ScheduledDate { get; set; }
    }
}
