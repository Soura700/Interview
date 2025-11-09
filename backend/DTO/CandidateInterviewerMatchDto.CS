namespace backend.DTO;

public class CandidateInterviewerMatchDto
{
    public CandidateDto Candidate { get; set; }
    public List<InterviewerDto> SuggestedInterviewers { get; set; }
}