using AutoMapper;
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
    [Route("api")]
    public class SessionController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SessionController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("qualifications/{qualificationId}/therepuets/{therepuetId}/sessions")]
        public async Task<IActionResult> GetAllByQualification(int qualificationId, int therepuetId)
        {
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            Therepuet? therepuet = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .Where(t => t.UserId == therepuetId)
                                                        .FirstOrDefaultAsync();
            if (therepuet == default)
            {
                return NotFound(new ErrorMessage() { Message = "No session for this therepuet is available." });
            }

            List<SessionDto> availableSessions = await _context.Sessions.Where(s => s.ClientId == null && s.TherepuetId == therepuet.UserId)
                                                                                .Select(s => _mapper.Map<SessionDto>(s))
                                                                                .ToListAsync();
            if (availableSessions.Count < 1)
            {
                return NotFound("No session for this therepuet is available.");
            }

            return Ok(availableSessions);
        }

        [HttpGet("qualifications/{qualificationId}/therepuets/{therepuetId}/sessions/{sessionId}")]
        public async Task<IActionResult> GetOneByQualification(int qualificationId, int therepuetId, int sessionId)
        {
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }
            Therepuet? therepuet = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .Where(t => t.UserId == therepuetId)
                                                        .FirstOrDefaultAsync();
            if (therepuet == default)
            {
                return NotFound(new ErrorMessage() { Message = "No session for this therepuet is available." });
            }

            SessionDto? session = await _context.Sessions.Where(s => s.ClientId == null && s.TherepuetId == therepuet.UserId && s.Id == sessionId)
                                                        .Select(s => _mapper.Map<SessionDto>(s))
                                                        .FirstOrDefaultAsync();
            if (session == default)
            {
                return NotFound(new ErrorMessage() { Message = "No such session was found." });
            }

            return Ok(session);
        }

        //Get therepuets/clients sessions
        // users/{userId}/sessions
        [HttpGet("sessions")]
        [Authorize(Roles = "Client, Therepuet")]
        public async Task<IActionResult> GetAllByUser()
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            List<Session> sessions = await _context.Sessions
                .Include(s => s.Therepuet)
                .Include(s => s.Therepuet.User)
                .Include(s => s.Client)
                .Where(x => x.TherepuetId == userId || x.ClientId == userId)
                .ToListAsync();

            if (sessions.Count < 1)
            {
                return NotFound(new ErrorMessage() { Message = "No session for this user was found." });
            }

            string role = User.Claims.First(x => x.Type == ClaimTypes.Role).Value;

            if(role == "Client")
            {
                List<ClientSessionDto> clientSessions = sessions.Select(s => _mapper.Map<ClientSessionDto>(s)).ToList();
                return Ok(clientSessions);
            }

            List<TherepuetSessionDto> therepuetSessions = sessions.Select(s => _mapper.Map<TherepuetSessionDto>(s)).ToList();
            return Ok(therepuetSessions);
        }

        //Get therepuets/clients sessions
        // users/{userId}/sessions/{sessionId}
        [HttpGet("sessions/{sessionId}")]
        [Authorize(Roles = "Client, Therepuet")]
        public async Task<IActionResult> GetOneByUser(int sessionId)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            Session? session = await _context.Sessions
                .Include(s => s.Therepuet)
                .Include(s => s.Therepuet.User)
                .Include(s => s.Client)
                .Where(x => x.Id == sessionId && (x.TherepuetId == userId || x.ClientId == userId))
                .FirstOrDefaultAsync();

            if (session == default)
            {
                return NotFound(new ErrorMessage() { Message = "No such session was found." });
            }

            string role = User.Claims.First(x => x.Type == ClaimTypes.Role).Value;

            if (role == "Client")
            {
                return Ok(_mapper.Map<ClientSessionDto>(session));
            }

            return Ok(_mapper.Map<TherepuetSessionDto>(session));
        }

        [HttpPost("sessions")]
        [Authorize(Roles = "Therepuet")]
        public async Task<IActionResult> CreateSession(CreateSessionDto sessionRequest)
        {
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            List<Session> sessionsOnThisTime = await _context.Sessions.Where(s => s.TherepuetId == userId &&
                                                                      SessionTimeOccupied(sessionRequest.StartTime, sessionRequest.DurationInMinutes, s.StartTime, s.DurationInMinutes))
                                                                      .ToListAsync();

            if ((!sessionsOnThisTime.Any() && sessionsOnThisTime.Count > 0) || sessionRequest.DurationInMinutes < 0)
            {
                return BadRequest(new ErrorMessage() { Message = "Session time invalid." });
            }

            Session session = new()
            {
                StartTime = sessionRequest.StartTime,
                DurationInMinutes = sessionRequest.DurationInMinutes,
                TherepuetId = userId
            };

            await _context.Sessions.AddAsync(session);
            await _context.SaveChangesAsync();
            return Created("", _mapper.Map<SessionDto>(session));
        }

        [HttpDelete("sessions/{id}")]
        [Authorize(Roles = "Therepuet")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            if (!await SessionExists(id))
            {
                return NotFound(new ErrorMessage() { Message = "No session was found." });
            }

            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            bool sessionCanBeDeleted = await _context.Sessions.AnyAsync(s => s.Id == id && s.ClientId == null);

            if (sessionCanBeDeleted)
            {
                _context.Sessions.Remove(await _context.Sessions.FirstAsync(s => s.Id == id));
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return BadRequest("Session cannot be deleted.");
        }

        [HttpPatch("sessions/{id}/note")]
        [Authorize(Roles = "Therepuet")]
        public async Task<IActionResult> UpdateSessionNote(int id, [FromBody] NoteDto notes)
        {
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            if (!await SessionExists(id))
            {
                return NotFound(new ErrorMessage() { Message = "No session was found." });
            }

            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            bool sessionCanBeUpdated = await _context.Sessions.AnyAsync(s => s.Id == id && s.ClientId != null && s.SessionHasEnded());

            if (sessionCanBeUpdated)
            {
                Session session = await _context.Sessions.FirstAsync(s => s.Id == id);
                session.Notes = notes.Notes;
                await _context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest(new ErrorMessage() { Message = "Sessions notes cannot be updated." });
        }

        [HttpPatch("sessions/{id}/reservation")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> UpdateSessionReservation(int id, [FromBody] ReservationDto reservation)
        {
            if (_context.Sessions == null)
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            if (!await SessionExists(id))
            {
                return NotFound(new ErrorMessage() { Message = "No session table was found." });
            }

            if (reservation.IsReservation)
            {
                return await CreateSessionReservation(id);
            }

            return await DeleteSessionReservation(id);
        }

        private async Task<IActionResult> CreateSessionReservation(int id)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            bool sessionExist = await SessionExists(id);
            bool sessionCanBeReserved = _context.Sessions.ToList().Where(s => s.Id == id && s.ClientId == null && Is24HoursTillSession(s.StartTime)).Any();

            if (sessionCanBeReserved)
            {
                Session session = await _context.Sessions.FirstAsync(s => s.Id == id);
                session.ClientId = userId;

                int responsew = await _context.SaveChangesAsync();

                if(responsew == 0)
                {
                    return BadRequest(new ErrorMessage() { Message = "This session is no longer available" });
                }

                return Ok();
            }

            return BadRequest(new ErrorMessage() { Message = "Sessions cannot be reserved." });
        }

        private async Task<IActionResult> DeleteSessionReservation(int id)
        {
            int userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
            Session? session =  _context.Sessions.ToList().FirstOrDefault(s => s.Id == id && s.ClientId == userId && Is24HoursTillSession(s.StartTime));
            if (session != null)
            {
                session.ClientId = null;
                await _context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest(new ErrorMessage() { Message = "Sessions cannot be canceled." });
        }
        private static bool Is24HoursTillSession(DateTime start)
        {
            DateTime oneDayBeforeSessionStart = start - TimeSpan.FromDays(1);
            return DateTime.UtcNow <= oneDayBeforeSessionStart;
        }

        private static bool SessionTimeOccupied(DateTime newStart, int newDuration, DateTime oldStart, int oldDuration)
        {
            DateTime newEnd = newStart + TimeSpan.FromMinutes(newDuration);
            DateTime oldEnd = oldStart + TimeSpan.FromMinutes(oldDuration);
            return !(newStart < oldStart && newEnd < oldStart) && !(newStart > oldEnd && newEnd > oldEnd);
        }

        private async Task<bool> SessionExists(int id)
        {
            return await _context.Sessions.AnyAsync(u => u.Id == id);
        }
    }
}
