using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Connect_Backend.Models
{
    public class Therepuet
    {
        [Key]
        public int UserId { get; set; }
        public string? Description { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public ICollection<Session>? Sessions { get; set; }
    }
}
