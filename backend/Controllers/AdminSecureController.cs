using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin/secure")]
    [Authorize(Roles = "Admin")]
    public class AdminSecureController : ControllerBase
    {
        [HttpGet("check")]
        public IActionResult CheckAdmin()
        {
            return Ok(new { authenticated = true });
        }
    }
}
