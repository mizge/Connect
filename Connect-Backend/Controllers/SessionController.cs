using Connect_Backend.Data;
using Connect_Backend.Models;
using Connect_Backend.Requests;
using Connect_Backend.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class SessionController : Controller
    {
        private readonly ApplicationDbContext _context;
        public SessionController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("qualifications/{qualificationId}/therepuets/{therepuetId}/sessions")]
        public async Task<IActionResult> GetAllByQualification(int qualificationId, int therepuetId)
        {
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            var therepuet = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .Where(t => t.UserId == therepuetId)
                                                        .FirstOrDefaultAsync();
            if (therepuet == default)
            {
                return NotFound("No session for this therepuet is available.");
            }
            var availableSessions = await _context.Sessions.Where(s => s.ClientId == null && s.TherepuetId == therepuet.UserId)
                                                        .Select(s => new SessionResponse(s))
                                                        .ToListAsync();
            if (availableSessions.Count() < 1)
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
                return NotFound("No session table was found.");
            }
            var therepuet = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .Where(t => t.UserId == therepuetId)
                                                        .FirstOrDefaultAsync();
            if (therepuet == default)
            {
                return NotFound("No session for this therepuet is available.");
            }
            var session = await _context.Sessions.Where(s => s.ClientId == null && s.TherepuetId == therepuet.UserId)
                                                        .Select(s => new SessionResponse(s))
                                                        .FirstOrDefaultAsync();
            if (session == default)
            {
                return NotFound("No such session was found.");
            }
            return Ok(session);
        }
        //Get therepuets/clients sessions
        // users/{userId}/sessions
        [HttpGet("sessions")]
        [Authorize(Roles = "Client, Therepuet")]
        public async Task<IActionResult> GetAllByUser()
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            List<Session> sessions = await _context.Sessions.Where(x => x.TherepuetId == userId || x.ClientId == userId).ToListAsync();
            if (sessions.Count() < 1)
            {
                return NotFound("No session for this user was found.");
            }
            return Ok(sessions);
        }
        //Get therepuets/clients sessions
        // users/{userId}/sessions/{sessionId}
        [HttpGet("sessions/{sessionId}")]
        [Authorize(Roles = "Client, Therepuet")]
        public async Task<IActionResult> GetOneByUser(int sessionId)
        {
            int userId = int.Parse(User.Claims.First().Value);
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            var session = await _context.Sessions.Where(x => x.Id == sessionId && (x.TherepuetId == userId || x.ClientId == userId)).FirstOrDefaultAsync();
            if (session == default)
            {
                return NotFound("No such session was found.");
            }
            return Ok(session);
        }
        [HttpPost("sessions")]
        [Authorize(Roles = "Therepuet")]
        public ActionResult CreateSession(Session sessionRequest)
        {
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            int userId = int.Parse(User.Claims.First().Value);
            bool therepuetHasAnySessions = _context.Sessions.ToList().Any();
            bool sessionsTimeImpossible = _context.Sessions.ToList().Where(s => s.TherepuetId == userId &&
                SessionTimeNotOccupied(sessionRequest.StartTime, sessionRequest.DurationInMinutes, s.StartTime, s.DurationInMinutes)).Any();
            if (!sessionsTimeImpossible && therepuetHasAnySessions)
            {
                return BadRequest("Session time invalid.");
            }
            Session session = new Session()
            {
                Id = GetNewSessionId(),
                StartTime = sessionRequest.StartTime,
                DurationInMinutes = sessionRequest.DurationInMinutes,
                TherepuetId = userId,
                Therepuet = _context.Therepuets.First(x => x.UserId == userId)
            };
            _context.Sessions.Add(session);
            _context.SaveChanges();
            return Ok("Session created.");
        }
        [HttpDelete("sessions/{id}")]
        [Authorize(Roles = "Therepuet")]
        public ActionResult DeleteSession(int id)
        {
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            if (!SessionExists(id))
            {
                return NotFound("No session was found.");
            }
            int userId = int.Parse(User.Claims.First().Value);
            bool sessionCanBeDeleted = _context.Sessions.Where(s => s.Id == id && s.ClientId == null).Any();
            if (sessionCanBeDeleted)
            {
                _context.Sessions.Remove(_context.Sessions.Where(s => s.Id == id).First());
                _context.SaveChanges();
                return Ok("Session deleted.");
            }

            return BadRequest("Session cannot be deleted.");
        }
        [HttpPatch("sessions/{id}/note")]
        [Authorize(Roles = "Therepuet")]
        public ActionResult UpdateSessionNote(int id, [FromBody] NotesRequest notes)
        {
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            if (!SessionExists(id))
            {
                return NotFound("No session was found.");
            }
            int userId = int.Parse(User.Claims.First().Value);
            bool sessionCanBeUpdated = _context.Sessions.ToList().Where(s => s.Id == id && s.ClientId != null && s.SessionHasEnded()).Any();
            if (sessionCanBeUpdated)
            {
                Session session = _context.Sessions.Where(s => s.Id == id).First();
                session.Notes = notes.Notes;
                _context.Sessions.Update(session);
                _context.SaveChanges();
                return Ok("Session notes have been updated.");
            }

            return BadRequest("Sessions notes cannot be updated.");
        }
        [HttpPatch("sessions/{id}/reservation")]
        [Authorize(Roles = "Client")]
        public ActionResult UpdateSessionReservation(int id, [FromBody] ReservationRequest reservation)
        {
            if (_context.Sessions == null)
            {
                return NotFound("No session table was found.");
            }
            if (!SessionExists(id))
            {
                return NotFound("No session was found.");
            }
            if (reservation.IsReservation)
            {
                return CreateSessionReservation(id);
            }
            return DeleteSessionReservation(id);
        }

        private ActionResult CreateSessionReservation(int id)
        {
            int userId = int.Parse(User.Claims.First().Value);
            bool sessionCanBeReserved = _context.Sessions.ToList().Where(s => s.Id == id && s.ClientId == null && Is24HoursTillSession(s.StartTime)).Any();
            if (sessionCanBeReserved)
            {
                Session session = _context.Sessions.Where(s => s.Id == id).First();
                session.ClientId = userId;
                _context.Sessions.Update(session);
                _context.SaveChanges();
                return Ok("Session have been reserved.");
            }

            return BadRequest("Sessions cannot be reserved.");
        }
        private ActionResult DeleteSessionReservation(int id)
        {
            int userId = int.Parse(User.Claims.First().Value);
            Session? session = _context.Sessions.ToList().FirstOrDefault(s => s.Id == id && s.ClientId == userId && Is24HoursTillSession(s.StartTime));
            if (session != null)
            {
                session.ClientId = null;
                _context.Sessions.Update(session);
                _context.SaveChanges();
                return Ok("Session have been canceled.");
            }

            return BadRequest("Sessions cannot be canceled.");
        }

        private bool Is24HoursTillSession(DateTime start)
        {
            DateTime oneDayBeforeSessionStart = start - TimeSpan.FromDays(1);
            return DateTime.UtcNow <= oneDayBeforeSessionStart;
        }
        private bool SessionTimeNotOccupied(DateTime newStart, int newDuration, DateTime oldStart, int oldDuration)
        {
            DateTime newEnd = newStart + TimeSpan.FromMinutes(newDuration);
            DateTime oldEnd = oldStart + TimeSpan.FromMinutes(oldDuration);
            return (newStart < oldStart && newEnd < oldStart) || (newStart > oldEnd && newEnd > oldEnd);
        }
        private int GetNewSessionId()
        {
            Session lastUser = _context.Sessions.OrderBy(u => u.Id).LastOrDefault()!;
            if (lastUser == default)
            {
                return 1;
            }
            else
            {
                return lastUser.Id + 1;
            }
        }
        private bool SessionExists(int id)
        {
            return _context.Sessions.Where(u => u.Id == id).Any();
        }
    }
}
