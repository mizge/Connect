using Connect_Backend.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Connect_Backend.Dtos
{
    public class CreatedUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public int RoleId { get; set; }
    }
}
