namespace Connect_Backend.Models
{
    public class Homework
    {
        public int Id { get; set; }
        public string Task { get; set; }
        public DateTime Time { get; set; }
        public int SessionId { get; set; }
        public Session Session { get; set; }
    }
}
