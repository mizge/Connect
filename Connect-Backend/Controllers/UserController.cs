using AutoMapper;
using Connect_Backend.Authorization;
using Connect_Backend.Data;
using Connect_Backend.Dtos;
using Connect_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtUtils _jwtUtils;
        private readonly IMapper _mapper;
        public UserController(ApplicationDbContext context, IJwtUtils jwtUtils, IMapper mapper)
        {
            _context = context;
            _jwtUtils = jwtUtils;
            _mapper = mapper;
        }
        [HttpPost("client")]
        public async Task<IActionResult> RegisterClient(CreateClientDto request)
        {
            if (EmailExists(request.Email))
            {
                return BadRequest("Email already exists.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            User user = new User()
            {
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                Password = passwordHash,
                RoleId = request.RoleId,
                Role = _context.Roles.First(x => x.Id == request.RoleId)
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Created("", _mapper.Map<CreatedUserDto>(user));
        }
        [HttpPost("therepuet")]
        public async Task<IActionResult> RegisterTherepuet(CreateTherepuetDto request)
        {
            if (EmailExists(request.Email))
            {
                return BadRequest("Email already exists.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            User user = new User()
            {
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                Password = passwordHash,
                RoleId = request.RoleId,
                Role = _context.Roles.First(x => x.Id == request.RoleId)
            };

            _context.Users.Add(user);
            Therepuet therepuet = new Therepuet()
            {
                UserId = user.Id,
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
            if(!EmailExists(request.Email))
            {
                return BadRequest("Incorrect credentials.");
            }

            User user = await _context.Users.FirstAsync(x => x.Email == request.Email);

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password.Trim()))
            {
                return BadRequest("Incorrect credentials.");
            }

            user.Role = await _context.Roles.Where(x => x.Id == user.RoleId).FirstAsync();
            string jwtToken = _jwtUtils.GenerateToken(user);

            return Created("", $"{jwtToken}");
        }

        private bool EmailExists(string email)
        {
            string? existingEmail =  _context.Users.Select(u => u.Email).FirstOrDefault(e => e == email);
            if(existingEmail != null)
            {
                return true;
            }
            return false;
        }
    }
}
