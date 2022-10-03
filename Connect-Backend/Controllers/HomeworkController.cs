using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Connect_Backend.Data;
using Connect_Backend.Models;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Connect_Backend.Dtos;

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
        [Authorize(Roles = "Client, Therepuet")]
        public async Task<IActionResult> GetAll(int sessionId)
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Homeworks == null)
            {
                return NotFound("No homework table was found.");
            }
            List<Homework> homeworks = await _context.Homeworks
                .Include(x => x.Session)
                .Where(x  => x.Session.Id == sessionId && (x.Session.ClientId == userId || x.Session.TherepuetId == userId))
                .Include(x => x.Session.Therepuet)
                .ToListAsync();


            if (homeworks.Count() < 1)
            {
                return NotFound("No homework for this user was not found.");
            }
            List<HomeworkDto> homeworkDtos = homeworks.Select(h => _mapper.Map<HomeworkDto>(h)).ToList();
            return Ok(homeworkDtos);
        }
        // Get users sessions homework
        // users/{userId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpGet("sessions/{sessionId}/homeworks/{homeworkId}")]
        [Authorize(Roles = "Client, Therepuet")]
        public async Task<IActionResult> Get(int sessionId, int homeworkId)
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Homeworks == null)
            {
                return NotFound("No homework table was found.");
            }

            Homework? homework = await _context.Homeworks
                .Include(x => x.Session)
                .Where(x => x.Id == homeworkId && x.Session.Id == sessionId && (x.Session.ClientId == userId || x.Session.TherepuetId == userId))
                .FirstOrDefaultAsync();
            if (homework == null)
            {
                return NotFound("This homework for this user was not found.");
            }

            return Ok(_mapper.Map<HomeworkDto>(homework));
        }
        // Create therepuets sessions homework
        // therepuets/{therepuetId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpPost("sessions/{sessionId}/homeworks")]
        [Authorize(Roles = "Therepuet")]
        public async Task<IActionResult> Create(int sessionId, HomeworkDto homeworksRequests)
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Homeworks == null)
            {
                return NotFound("No homework table was found.");
            }
            if(!HomeworkCanBeCreated(sessionId, userId))
            {
                return BadRequest("No such session exist.");
            }
            Homework homework = new Homework() { Task = homeworksRequests.Task, Time = homeworksRequests.Time, SessionId = sessionId };
            await _context.Homeworks.AddAsync(homework);
            await _context.SaveChangesAsync();
            return Created("", _mapper.Map<HomeworkDto>(homework));
        }
        // Update therepuets sessions homework
        // therepuets/{therepuetId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpPut("sessions/{sessionId}/homeworks/{homeworkId}")]
        [Authorize(Roles = "Therepuet")]
        public async Task<IActionResult> Edit(int sessionId, int homeworkId, HomeworkDto homeworksRequests)
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Homeworks == null)
            {
                return NotFound("No homework table was found.");
            }
            Homework? homework = await _context.Homeworks
                .Include(x => x.Session)
                .FirstOrDefaultAsync(x => x.Id == homeworkId && x.Session.TherepuetId == userId && x.Session.Id == sessionId);
            if (homework == null)
            {
                return NotFound("This session's homework can't be found.");
            }
            homework.Task = homeworksRequests.Task;
            homework.Time = homeworksRequests.Time;
            _context.Update(homework);
            await _context.SaveChangesAsync();
            return Ok("Homework has been updated.");
        }
        // Deleye therepuets sessions homework
        // therepuets/{therepuetId}/sessions/{sessionId}/homeworks/{homeworksId}
        [HttpDelete("sessions/{sessionId}/homeworks/{homeworkId}")]
        [Authorize(Roles = "Therepuet")]
        public async Task<IActionResult> Delete(int sessionId, int homeworkId)
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Homeworks == null)
            {
                return NotFound("No homework table was found.");
            }
            Homework? homework = await _context.Homeworks
            .Include(x => x.Session)
                .FirstOrDefaultAsync(x => x.Id == homeworkId && x.Session.TherepuetId == userId && x.Session.Id == sessionId);

            if (homework == null)
            {
                return NotFound("This session's homework can't be found.");
            }
            _context.Remove(homework);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HomeworkCanBeCreated(int sessionId, int therepuetId)
        {
            Session? session = _context.Sessions.Where(x => x.Id == sessionId && x.TherepuetId == therepuetId && x.ClientId != null).FirstOrDefault();
            if(session == null)
            {
                return false;
            }

            return session.SessionHasEnded();
        }
    }
}
