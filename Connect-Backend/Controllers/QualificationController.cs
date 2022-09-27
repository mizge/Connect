using Connect_Backend.Data;
using Connect_Backend.Models;
using Connect_Backend.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.Entity;


namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api/qualifications")]
    public class QualificationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public QualificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            if (_context.Qualifications == null)
            {
                return NotFound("No qualification table was found.");
            }
            List<Qualification> qualifications = _context.Qualifications.Select(q => q).ToList();
            if (qualifications.Any())
            {
                return Ok(qualifications);
            }
            return NotFound("No qualification was found.");
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            if (_context.Qualifications == null)
            {
                return NotFound("No qualification table was found.");
            }
            Qualification qualifications = _context.Qualifications.FirstOrDefault(q => q.Id == id)!;
            if (qualifications == null)
            {
                return NotFound("No qualification was found.");
            }

            return Ok(qualifications);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public ActionResult Create(QualificationRequest qualificationRequest)
        {
            if (_context.Qualifications == null)
            {
                return NotFound("No qualification table was found.");
            }
            Qualification qualification = new Qualification()
            {
                Id = GetNewQualificationId(),
                Name = qualificationRequest.Name,
                Description = qualificationRequest.Description
            };
            _context.Qualifications.Add(qualification);
            _context.SaveChanges();
            return Ok("Qualification created.");
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult Edit(int id, QualificationRequest qualificationRequest)
        {
            if (_context.Qualifications == null)
            {
                return NotFound("No qualification table was found.");
            }

            Qualification qualification = _context.Qualifications.FirstOrDefault(q => q.Id == id)!;
            if (qualification == null)
            {
                return NotFound("No qualification was found.");
            }
            qualification.Name = qualificationRequest.Name;
            qualification.Description = qualificationRequest.Description;
            _context.Qualifications.Update(qualification);
            _context.SaveChanges();
            return Ok("Qualification updated.");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult Delete(int id)
        {
            if (_context.Qualifications == null)
            {
                return NotFound("No qualification table was found.");
            }

            Qualification qualification =  _context.Qualifications.FirstOrDefault(m => m.Id == id)!;
            if (qualification == null)
            {
                return NotFound("No qualification was found.");
            }
            int therepuetsCount = _context.TherepuetsQualifications.Where(tq => tq.QualificationId == id).Count();
            if(therepuetsCount > 0)
            {
                return BadRequest("The qualification cannot be deleted.");
            }
            _context.Qualifications.Remove(qualification);
            _context.SaveChanges();
            return Ok("Qualification deleted.");
        }
        private int GetNewQualificationId()
        {
            Qualification lastQualification = _context.Qualifications.OrderBy(u => u.Id).LastOrDefault()!;
            if (lastQualification == default)
            {
                return 1;
            }
            else
            {
                return lastQualification.Id + 1;
            }
        }
    }
}
