using backend.Data;
using backend.DTO.Reports;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CandidateReportDto>> GetRejectedCandidatesByMonth(int year, int month)
        {
            return await _context.InterviewAssignments
                .Where(a => a.Status == "Rejected" &&
                            a.ScheduledDate.Year == year &&
                            a.ScheduledDate.Month == month)
                .Include(a => a.Candidate)
                .Select(a => new CandidateReportDto
                {
                    CandidateId = a.CandidateId,
                    FullName = a.Candidate.FullName,
                    Email = a.Candidate.Email,
                    SkillSet = a.Candidate.SkillSet,
                    Status = a.Status,
                    Month = a.ScheduledDate.ToString("MMMM")
                })
                .ToListAsync();
        }

        public async Task<List<CandidateReportDto>> GetProposalRejectedCandidatesByMonth(int year, int month)
        {
            return await _context.InterviewAssignments
                .Where(a => a.Status == "ProposalRejected" &&
                            a.ScheduledDate.Year == year &&
                            a.ScheduledDate.Month == month)
                .Include(a => a.Candidate)
                .Select(a => new CandidateReportDto
                {
                    CandidateId = a.CandidateId,
                    FullName = a.Candidate.FullName,
                    Email = a.Candidate.Email,
                    SkillSet = a.Candidate.SkillSet,
                    Status = a.Status,
                    Month = a.ScheduledDate.ToString("MMMM")
                })
                .ToListAsync();
        }

        public async Task<List<CandidateReportDto>> GetSuccessfulCandidatesBySkillAndMonth(string skill, int year, int month)
        {
            skill = skill.ToLower().Trim();

            return await _context.InterviewAssignments
                .Where(a => a.Status == "Selected" &&
                            a.ScheduledDate.Year == year &&
                            a.ScheduledDate.Month == month &&
                            a.Candidate.SkillSet.ToLower().Contains(skill))
                .Include(a => a.Candidate)
                .Select(a => new CandidateReportDto
                {
                    CandidateId = a.CandidateId,
                    FullName = a.Candidate.FullName,
                    Email = a.Candidate.Email,
                    SkillSet = a.Candidate.SkillSet,
                    Status = a.Status,
                    Month = a.ScheduledDate.ToString("MMMM")
                })
                .ToListAsync();
        }
    }
}
