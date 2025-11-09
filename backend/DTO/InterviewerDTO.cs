namespace backend.DTO;
public class InterviewerDto
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string SkillSet { get; set; }
    public string InterviewLevel { get; set; }
    public int ExperienceYears { get; set; }  
    public bool IsAvailable { get; set; }
}