using Azure.Core;
using Connect_Backend.Authorization;
using Connect_Backend.Data;
using Connect_Backend.Models;
using Connect_Backend.Requests;
using Microsoft.AspNetCore.Mvc;

namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtUtils _jwtUtils;
        public UserController(ApplicationDbContext context, IJwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }
        [HttpPost("register/client")]
        public ActionResult RegisterClient(ClientRegisterRequest request)
        {
            if (EmailExists(request.Email))
            {
                return BadRequest("Email already exists.");
            }
            int Id = GetNewUserId();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            User user = new User()
            {
                Id = Id,
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                Password = passwordHash,
                RoleId = request.RoleId,
                Role = _context.Roles.First(x => x.Id == request.RoleId)
            };
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok($"User created.");
        }
        [HttpPost("register/therepuet")]
        public ActionResult RegisterTherepuet(TherepuetRegisterRequest request)
        {
            if (EmailExists(request.Email))
            {
                return BadRequest("Email already exists.");
            }
            int Id = GetNewUserId();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            User user = new User()
            {
                Id = Id,
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
            _context.Therepuets.Add(therepuet);
            List<TherepuetsQualifications> therepuetsQualifications = request.Qualifications.Select(q => new TherepuetsQualifications(q, Id)).ToList();
            _context.TherepuetsQualifications.AddRange(therepuetsQualifications);
            _context.SaveChanges();
            return Ok($"User created.");
        }
        [HttpPost("login")]
        public ActionResult Login(LoginRequest request)
        {
            if(!EmailExists(request.Email))
            {
                return BadRequest("Incorrect credentials.");
            }
            User user = _context.Users.First(x => x.Email == request.Email);
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password.Trim()))
            {
                return BadRequest("Incorrect credentials.");
            }
            user.Role = _context.Roles.Where(x => x.Id == user.RoleId).First();
            string jwtToken = _jwtUtils.GenerateToken(user);
            int? val = _jwtUtils.ValidateToken(jwtToken);
            return Ok($"{jwtToken}");
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
        private int GetNewUserId()
        {
            User lastUser = _context.Users.OrderBy(u => u.Id).LastOrDefault();
            if (lastUser == default)
            {
                return 1;
            }
            else
            {
                return lastUser.Id + 1;
            }
        }
    }
}
