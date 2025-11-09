namespace backend.DTO;

public class CreateCandidateDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string SkillSet { get; set; }
    public string ResumePath { get; set; }
    public int ExperienceYears { get; set; }
}
