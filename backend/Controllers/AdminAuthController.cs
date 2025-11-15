using backend.Dto;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin/auth")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IAdminAuthService _service;

        public AdminAuthController(IAdminAuthService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginDto req)
        {
            var admin = await _service.GetAdminByEmail(req.Email);
            if (admin == null)
                return Unauthorized(new { message = "Invalid email" });

            if (!_service.VerifyPassword(req.Password, admin.PasswordHash))
                return Unauthorized(new { message = "Invalid password" });

            var jwt = _service.GenerateJwtToken(admin);

            Response.Cookies.Append("admin_token", jwt, new CookieOptions
            {
                HttpOnly = true,         // PRODUCTION SECURE CAUTION: set true to prevent JS access
                Secure = false,          // set true when using https
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { message = "Login successful" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("admin_token");
            return Ok(new { message = "Logged out" });
        }
    }
}
