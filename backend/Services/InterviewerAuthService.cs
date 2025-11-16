using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Utilities;

namespace backend.Services
{
    public class InterviewerAuthService : IInterviewerAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public InterviewerAuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<Interviewer?> GetInterviewerByEmail(string email)
        {
            return await _context.Interviewers.FirstOrDefaultAsync(i => i.Email == email);
        }

        public bool VerifyPassword(string password, string storedHash)
        {
            System.Console.WriteLine("Verifying password: " + password + " against hash: " + storedHash);
            return PasswordHasher.Hash(password) == storedHash;
        }

        public string GenerateJwtToken(Interviewer interviewer)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["JwtInterviewer:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", interviewer.Id.ToString()),
                new Claim(ClaimTypes.Email, interviewer.Email),
                new Claim(ClaimTypes.Role, "Interviewer")
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtInterviewer:Issuer"],
                audience: _config["JwtInterviewer:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
