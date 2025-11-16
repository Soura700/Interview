using backend.Dto;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/interviewer/auth")]
    public class InterviewerAuthController : ControllerBase
    {
        private readonly IInterviewerAuthService _authService;

        public InterviewerAuthController(IInterviewerAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(InterviewerLoginDto dto)
        {
            var interviewer = await _authService.GetInterviewerByEmail(dto.Email);

            if (interviewer == null)
            {
                System.Console.WriteLine("Interviewer not found with email: " + dto.Email);
                return Unauthorized("Invalid email or password.");
            }


            if (!_authService.VerifyPassword(dto.Password, interviewer.PasswordHash))
            {
                System.Console.WriteLine("Password verification failed for email: " + dto.Password + " / " + interviewer.PasswordHash);
                return Unauthorized("Invalid email or password.");
            }
            // return Unauthorized("Invalid email or password.");

            var token = _authService.GenerateJwtToken(interviewer);

            Response.Cookies.Append("interviewer_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { message = "Login successful" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("interviewer_token");
            return Ok(new { message = "Logged out" });
        }
    }
}
