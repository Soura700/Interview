using backend.DTO.Reports;

namespace backend.Interfaces;

    public interface IReportService
    {
        Task<List<CandidateReportDto>> GetRejectedCandidatesByMonth(int year, int month);
        Task<List<CandidateReportDto>> GetProposalRejectedCandidatesByMonth(int year, int month);
        Task<List<CandidateReportDto>> GetSuccessfulCandidatesBySkillAndMonth(string skill, int year, int month);
    }
