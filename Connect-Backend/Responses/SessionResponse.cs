using Connect_Backend.Models;

namespace Connect_Backend.Responses
{
    public class SessionResponse
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationInMinutes { get; set; }
        public int TherepuetId { get; set; }
        public SessionResponse(Session session)
        {
            Id = session.Id;
            StartTime = session.StartTime;
            DurationInMinutes = session.DurationInMinutes;
            TherepuetId = session.TherepuetId;
        }
    }
}
