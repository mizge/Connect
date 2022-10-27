using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Connect_Backend.Data;
using Connect_Backend.Models;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Connect_Backend.Dtos;
using System.Security.Claims;
using Connect_Backend.Helpers;
using Connect_Backend.Authorization.Model;

namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class HomeworkController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public HomeworkController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Get users sessions homeworks
        // users/{userId}/sessions/{sessionId}/homeworks
        [HttpGet("sessions/{sessionId}/homeworks")]
        [Authorize(Roles = $"{UserRoles.Therepuet}, {UserRoles.Client}")]
        public async Task<IActionResult> GetAll(int sessionId)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Homeworks == null)
            {
                return NotFound(new ErrorMessage() { Message = "No homework table was found." });
            }

            List<Homework> homeworks = await _context.Homeworks
                .Include(x => x.Session)
                .Where(x  => x.Session.Id == sessionId && (x.Session.ClientId == userId || x.Session.TherepuetId == userId))
                .Include(x => x.Session.Therepuet)
                .ToListAsync();


            if (homeworks.Count < 1)
            {
                return NotFound(new ErrorMessage() { Message = "No homework for this user was found." });
            }

            List<HomeworkDto> homeworkDtos = homeworks.Select(h => _mapper.Map<HomeworkDto>(h)).ToList();
            return Ok(homeworkDtos);
        }

        // Get users sessions homework
        // users/{userId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpGet("sessions/{sessionId}/homeworks/{homeworkId}")]
        [Authorize(Roles = $"{UserRoles.Therepuet}, {UserRoles.Client}")]
        public async Task<IActionResult> Get(int sessionId, int homeworkId)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Homeworks == null)
            {
                return NotFound(new ErrorMessage() { Message = "No homework table was found." });
            }

            Homework? homework = await _context.Homeworks
                .Include(x => x.Session)
                .Where(x => x.Id == homeworkId && x.Session.Id == sessionId && (x.Session.ClientId == userId || x.Session.TherepuetId == userId))
                .FirstOrDefaultAsync();

            if (homework == null)
            {
                return NotFound(new ErrorMessage() { Message = "No homework for this user was found." });
            }

            return Ok(_mapper.Map<HomeworkDto>(homework));
        }

        // Create therepuets sessions homework
        // therepuets/{therepuetId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpPost("sessions/{sessionId}/homeworks")]
        [Authorize(Roles = UserRoles.Therepuet)]
        public async Task<IActionResult> Create(int sessionId, HomeworkDto homeworksRequests)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Homeworks == null)
            {
                return NotFound(new ErrorMessage() { Message = "No homework table was found." });
            }

            if(!await HomeworkCanBeCreated(sessionId, userId))
            {
                return BadRequest(new ErrorMessage() { Message = "No such session exist." });
            }

            Homework homework = new() { Task = homeworksRequests.Task, Time = homeworksRequests.Time, SessionId = sessionId };
            await _context.Homeworks.AddAsync(homework);
            await _context.SaveChangesAsync();
            return Created("", _mapper.Map<HomeworkDto>(homework));
        }

        // Update therepuets sessions homework
        // therepuets/{therepuetId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpPut("sessions/{sessionId}/homeworks/{homeworkId}")]
        [Authorize(Roles = UserRoles.Therepuet)]
        public async Task<IActionResult> Edit(int sessionId, int homeworkId, HomeworkDto homeworksRequests)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Homeworks == null)
            {
                return NotFound(new ErrorMessage() { Message = "No homework table was found." });
            }

            Homework? homework = await _context.Homeworks
                .Include(x => x.Session)
                .FirstOrDefaultAsync(x => x.Id == homeworkId && x.Session.TherepuetId == userId && x.Session.Id == sessionId);

            if (homework == null)
            {
                return NotFound(new ErrorMessage() { Message = "This session's homework can't be found." });
            }

            homework.Task = homeworksRequests.Task;
            homework.Time = homeworksRequests.Time;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Deleye therepuets sessions homework
        // therepuets/{therepuetId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpDelete("sessions/{sessionId}/homeworks/{homeworkId}")]
        [Authorize(Roles = UserRoles.Therepuet)]
        public async Task<IActionResult> Delete(int sessionId, int homeworkId)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Homeworks == null)
            {
                return NotFound(new ErrorMessage() { Message = "No homework table was found." });
            }

            Homework? homework = await _context.Homeworks
            .Include(x => x.Session)
                .FirstOrDefaultAsync(x => x.Id == homeworkId && x.Session.TherepuetId == userId && x.Session.Id == sessionId);

            if (homework == null)
            {
                return NotFound(new ErrorMessage() { Message = "This session's homework can't be found." });
            }

            _context.Remove(homework);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> HomeworkCanBeCreated(int sessionId, int therepuetId)
        {
            Session? session = await _context.Sessions.Where(x => x.Id == sessionId && x.TherepuetId == therepuetId && x.ClientId != null).FirstOrDefaultAsync();
            if(session == null)
            {
                return false;
            }

            return session.SessionHasEnded();
        }
    }
}
