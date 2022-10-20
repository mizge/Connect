using Connect_Backend.Authorization;
using Connect_Backend.Data;
using Connect_Backend.Dtos;
using Connect_Backend.Helpers;
using Connect_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Connect_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtUtils _tokenService;
        public TokenController(ApplicationDbContext context, IJwtUtils tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> RefreshAsync(TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null)
            {
                return BadRequest(new ErrorMessage() { Message = "Invalid client request" });
            }

            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;
            ClaimsPrincipal principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            int userId = int.Parse(principal.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            User? user = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == userId);
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest(new ErrorMessage() { Message = "Invalid client request" });
            }

            string newAccessToken = _tokenService.GenerateToken(user);
            string newRefreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();
            return Ok(new AuthorizationDto() { AccessToken = accessToken, RefreshToken = refreshToken});
        }
    }
}
