using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Connect_Backend.Models
{
    public class Session
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public int DurationInMinutes { get; set; }
        public string? Notes { get; set; }
        public int TherepuetId { get; set; }
        [ConcurrencyCheck]
        public int? ClientId { get; set; }
        [JsonIgnore]
        public Therepuet Therepuet { get; set; }
        [JsonIgnore]
        public User? Client { get; set; }

        public bool SessionHasEnded()
        {
            DateTime sessionEnd = StartTime + TimeSpan.FromMinutes(DurationInMinutes);
            return DateTime.UtcNow >= sessionEnd;
        }
    }
}
