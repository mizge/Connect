using AutoMapper;
using Connect_Backend.Data;
using Connect_Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class TherepuetController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public TherepuetController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        [HttpGet("qualifications/{qualificationId}/therepuets")]
        public async Task<IActionResult> GetAll(int qualificationId)
        {
            if (_context.Therepuets == null)
            {
                return NotFound("No therepuet table was found.");
            }
            List<TherepuetDto> therepuets = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Include( t => t.Therepuet.User)
                                                        .Select(x => x.Therepuet)
                                                        .Select(t => _mapper.Map<TherepuetDto>(t))
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
            TherepuetDto? therepuet = await _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Include(x => x.Therepuet.User)
                                                        .Select(x => x.Therepuet)
                                                        .Where(x => x.UserId == therepuetId)
                                                        .Select(t => _mapper.Map<TherepuetDto>(t))
                                                        .FirstOrDefaultAsync();
            if (therepuet == default)
            {
                return NotFound("No such therepuet for this qualification was found.");
            }
            return Ok(therepuet);
        }
    }
}
