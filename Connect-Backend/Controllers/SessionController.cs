using Connect_Backend.Data;
using Connect_Backend.Models;
using Connect_Backend.Requests;
using Connect_Backend.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.Entity;


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
        [HttpGet("qualification/{qualificationId}/therepuet/{therepuetId}/sessions")]
        public ActionResult GetAll(int qualificationId, int therepuetId)
        {
            if (_context.Sessions == null)
            {
                return NotFound("No session was found.");
            }
            var availableSessions = _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .Where(t => t.UserId == therepuetId)
                                                        .Include(t => t.Sessions)
                                                        .SelectMany(t => t.Sessions)
                                                        .Where(s => s.ClientId == null)
                                                        .Select(s => new SessionResponse(s))
                                                        .ToList();
            if (availableSessions.Count() < 1)
            {
                return NotFound("No session for this therepuet is available.");
            }
            return Ok(availableSessions);
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
            bool sessionCanBeUpdated = _context.Sessions.ToList().Where(s => s.Id == id && s.ClientId != null && SessionHasEnded(s.StartTime, s.DurationInMinutes)).Any();
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
        private bool SessionHasEnded(DateTime start, int duration)
        {
            DateTime sessionEnd = start + TimeSpan.FromMinutes(duration);
            return DateTime.UtcNow >= sessionEnd;
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
