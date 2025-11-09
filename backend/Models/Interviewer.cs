namespace backend.Models;

public class Interviewer
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SkillSet { get; set; } = string.Empty;
    public string InterviewLevel { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Role property for role-based access
    public string Role { get; set; } = "Interviewer"; 

    // This field controls whether user should be redirected to Change Password page
    public bool FirstLogin { get; set; } = true;

    public int ExperienceYears { get; set; } // years of experience (helps matching)
    public bool IsAvailable { get; set; } = true; // simple availability toggle
}
