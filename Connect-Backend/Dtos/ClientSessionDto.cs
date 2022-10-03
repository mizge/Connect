using Connect_Backend.Models;

namespace Connect_Backend.Dtos
{
    public class ClientSessionDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationInMinutes { get; set; }
        public TherepuetDto Therepuet { get; set; }
    }
}
