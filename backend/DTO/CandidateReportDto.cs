namespace backend.DTO.Reports
{
    public class CandidateReportDto
    {
        public int CandidateId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SkillSet { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Month { get; set; } = string.Empty;
    }
}
