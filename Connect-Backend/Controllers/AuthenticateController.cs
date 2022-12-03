using AutoMapper;
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
    [ApiController]
    [Route("api/user")]
    public class AuthenticateController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtUtils _jwtUtils;
        private readonly IMapper _mapper;
        public AuthenticateController(ApplicationDbContext context, IJwtUtils jwtUtils, IMapper mapper)
        {
            _context = context;
            _jwtUtils = jwtUtils;
            _mapper = mapper;
        }
        [HttpPost("client")]
        public async Task<IActionResult> RegisterClient(CreateClientDto request)
        {
            if (await EmailExists(request.Email))
            {
                return BadRequest(new ErrorMessage() { Message = "Email already exists." });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            User user = new()
            {
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                Password = passwordHash,
                RoleId = request.RoleId
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Created("", _mapper.Map<CreatedUserDto>(user));
        }
        [HttpPost("therepuet")]
        public async Task<IActionResult> RegisterTherepuet(CreateTherepuetDto request)
        {
            if (await EmailExists(request.Email))
            {
                return BadRequest(new ErrorMessage() { Message = "Email already exists." });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            User user = new()
            {
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                Password = passwordHash,
                RoleId = request.RoleId,
                Role = await _context.Roles.FirstAsync(x => x.Id == request.RoleId)
            };

            await _context.Users.AddAsync(user);
            Therepuet therepuet = new()
            {
                UserId = user.Id,
                Description = request.Description,
                User = user
            };

            await _context.Therepuets.AddAsync(therepuet);
            await _context.SaveChangesAsync();

            List<TherepuetsQualifications> therepuetsQualifications = request.Qualifications.Select(q => new TherepuetsQualifications(q, user.Id)).ToList();
            await _context.TherepuetsQualifications.AddRangeAsync(therepuetsQualifications);
            await _context.SaveChangesAsync();

            return Created("", _mapper.Map<CreatedUserDto>(user));
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginDto request)
        {
            if(!await EmailExists(request.Email))
            {
                return BadRequest(new ErrorMessage() { Message = "Incorrect credentials." });
            }

            User user = await _context.Users.FirstAsync(x => x.Email == request.Email);

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password.Trim()))
            {
                return BadRequest(new ErrorMessage() { Message = "Incorrect credentials." });
            }

            user.Role = await _context.Roles.Where(x => x.Id == user.RoleId).FirstAsync();
            string jwtToken = _jwtUtils.GenerateToken(user);
            var refreshToken = _jwtUtils.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(2);
            _context.SaveChanges();
            return Created("", new AuthorizationDto() { AccessToken = jwtToken, RefreshToken = refreshToken, RoleId = user.RoleId});
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            User? user = _context.Users.Find(userId);

            if (user == null) {
                return BadRequest();
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<bool> EmailExists(string email)
        {
            string? existingEmail =  await _context.Users.Select(u => u.Email).FirstOrDefaultAsync(e => e == email);
            if(existingEmail != null)
            {
                return true;
            }
            return false;
        }
    }
}
