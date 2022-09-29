using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Connect_Backend.Models
{
    public class Session
    {
        public int Id { get; set; } = -1;
        public DateTime StartTime { get; set; }
        public int DurationInMinutes { get; set; }
        public string? Notes { get; set; }
        public int TherepuetId { get; set; } = -1;
        public int? ClientId { get; set; }
        // Ask someone could i make it not nullabel 
        public Therepuet? Therepuet { get; set; }
        public User? Client { get; set; }

        public bool SessionHasEnded()
        {
            DateTime sessionEnd = StartTime + TimeSpan.FromMinutes(DurationInMinutes);
            return DateTime.UtcNow >= sessionEnd;
        }
    }
}
