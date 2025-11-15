namespace backend.Models;

public class Candidate
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string SkillSet { get; set; }
    public int ExperienceYears { get; set; }
    public string ResumePath { get; set; }
    public string PasswordHash { get; set; }
    //Role property for role-based access
    public string Role { get; set; } = "Candidate";
    public bool FirstLogin { get; set; } = true;
    public string Status { get; set; } = "Active";

    public string InterviewStatus { get; set; } = "None";  // None / Pending / Booked / Completed
}
