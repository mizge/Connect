namespace Connect_Backend.Dtos
{
    public class CreateTherepuetDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
        public int RoleId = 2;
        public ICollection<int> Qualifications { get; set; }
        public string? Description { get; set; }
    }
}
