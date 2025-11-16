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
    public class CandidateAuthService : ICandidateAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public CandidateAuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<Candidate?> GetCandidateByEmail(string email)
        {
            return await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);
        }

        public string HashPassword(string password)
        {
            return PasswordHasher.Hash(password);
        }

        public bool VerifyPassword(string password, string storedHash)
        {
            string hashedInput = HashPassword(password);

            if (hashedInput != storedHash)
                return false;

            return true;
        }

        public string GenerateJwtToken(Candidate candidate)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["JwtCandidate:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", candidate.Id.ToString()),
                new Claim(ClaimTypes.Email, candidate.Email),
                new Claim(ClaimTypes.Role, "Candidate")
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtCandidate:Issuer"],
                audience: _config["JwtCandidate:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
