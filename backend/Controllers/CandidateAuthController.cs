using backend.Dto;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/candidate/auth")]
    public class CandidateAuthController : ControllerBase
    {
        private readonly ICandidateAuthService _service;

        public CandidateAuthController(ICandidateAuthService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CandidateLoginDto req)
        {
            var candidate = await _service.GetCandidateByEmail(req.Email);

            if (candidate == null)
                return Unauthorized(new { message = "Invalid email" });
            

            if (!_service.VerifyPassword(req.Password, candidate.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid password" });
            }

            var jwt = _service.GenerateJwtToken(candidate);

            Response.Cookies.Append("candidate_token", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,          // change to TRUE for HTTPS
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { message = "Login successful" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("candidate_token");
            return Ok(new { message = "Logged out" });
        }
    }
}
