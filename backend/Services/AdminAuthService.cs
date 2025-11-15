using backend.Interfaces;
using backend.Models;
using backend.Data; // IMPORTANT
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Utilities;

namespace backend.Services
{
    public class AdminAuthService : IAdminAuthService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _db; // FIXED

        public AdminAuthService(IConfiguration config, AppDbContext db)
        {
            _config = config;
            _db = db;
        }

        public async Task<Admin?> GetAdminByEmail(string email)
        {
            return await _db.Admins.FirstOrDefaultAsync(x => x.Email == email);
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

        public string GenerateJwtToken(Admin admin)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", admin.Id.ToString()),
                new Claim(ClaimTypes.Email, admin.Email),
                new Claim(ClaimTypes.Role, admin.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
