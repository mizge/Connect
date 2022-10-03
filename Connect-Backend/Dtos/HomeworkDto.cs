namespace Connect_Backend.Dtos
{
    public class HomeworkDto
    {
        public int Id { get; set; }
        public string Task { get; set; }
        public DateTime Time { get; set; }
        public int SessionId { get; set; }
    }
}
