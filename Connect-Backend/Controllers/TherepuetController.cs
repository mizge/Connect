using Connect_Backend.Data;
using Connect_Backend.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class TherepuetController : Controller
    {
        private readonly ApplicationDbContext _context;
        public TherepuetController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("qualifications/{qualificationId}/therepuets")]
        public async Task<IActionResult> GetAll(int qualificationId)
        {
            if (_context.Therepuets == null)
            {
                return NotFound("No therepuet table was found.");
            }
            var therepuets = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .ToListAsync();
            if (therepuets.Count() < 1)
            {
                return NotFound("No therepuets for this qualification was found.");
            }
            return Ok(therepuets);
        }
        [HttpGet("qualifications/{qualificationId}/therepuets/{therepuetId}")]
        public async Task<IActionResult> Get(int qualificationId, int therepuetId)
        {
            if (_context.Therepuets == null)
            {
                return NotFound("No therepuet table was found.");
            }
            var therepuet = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Select(x => x.Therepuet)
                                                        .Where(x => x.UserId == therepuetId)
                                                        .FirstOrDefaultAsync();
            if (therepuet == default)
            {
                return NotFound("No such therepuet for this qualification was found.");
            }
            return Ok(therepuet);
        }
    }
}
