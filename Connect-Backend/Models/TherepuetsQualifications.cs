using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Connect_Backend.Models
{
    public class TherepuetsQualifications
    {
        public int QualificationId { get; set; }
        public int TherepuetId { get; set; }

        [ForeignKey("QualificationId")]
        public Qualification Qualification { get; set; }
        [ForeignKey("TherepuetId")]
        public Therepuet Therepuet { get; set; }

        public TherepuetsQualifications(int qualificationId, int therepuetId)
        {
            QualificationId = qualificationId;
            TherepuetId = therepuetId;
        }
    }
}
