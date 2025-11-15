namespace backend.DTO;

public class CreateInterviewerDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SkillSet { get; set; } = string.Empty;
    public string InterviewLevel { get; set; } = string.Empty;

    public int ExperienceYears { get; set; }

    public bool IsAvailable { get; set; } = true;
    // NEW FIELD
    public string AvailabilityStatus { get; set; } = "Free";
}