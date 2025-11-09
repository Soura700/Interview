namespace backend.DTO;
public class CandidateDto
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string SkillSet { get; set; }
    public int ExperienceYears { get; set; }
    public string? ResumePath { get; set; }
}