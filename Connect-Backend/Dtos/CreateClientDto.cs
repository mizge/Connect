namespace Connect_Backend.Dtos
{
    public class CreateClientDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
        public int RoleId = 3;
    }
}
