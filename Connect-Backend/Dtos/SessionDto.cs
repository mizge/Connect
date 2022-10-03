using Newtonsoft.Json;

namespace Connect_Backend.Dtos
{
    public class SessionDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationInMinutes { get; set; }
        public int TherepuetId { get; set; }
    }
}
