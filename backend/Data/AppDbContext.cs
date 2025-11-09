using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext

{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Interviewer> Interviewers { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<InterviewAssignment> InterviewAssignments { get; set; }
}
