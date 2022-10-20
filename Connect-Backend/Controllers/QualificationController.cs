using AutoMapper;
using Connect_Backend.Data;
using Connect_Backend.Dtos;
using Connect_Backend.Helpers;
using Connect_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Connect_Backend.Controllers
{
    [ApiController]
    [Route("api/qualifications")]
    public class QualificationController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public QualificationController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (_context.Qualifications == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification table was found." });
            }

            List<Qualification> qualifications = await _context.Qualifications.ToListAsync();

            if (qualifications.Any())
            {
                return Ok(qualifications);
            }

            return NotFound(new ErrorMessage() { Message = "No qualification was found." });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            if (_context.Qualifications == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification table was found." });
            }

            Qualification? qualifications = await _context.Qualifications.FindAsync(id);

            if (qualifications == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification was found." });
            }

            return Ok(qualifications);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(QualificationDto qualificationRequest)
        {
            if (_context.Qualifications == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification table was found." });
            }

            Qualification qualification = new()
            {
                Name = qualificationRequest.Name,
                Description = qualificationRequest.Description
            };

            await _context.Qualifications.AddAsync(qualification);
            await _context.SaveChangesAsync();
            return Created("", _mapper.Map<QualificationDto>(qualification));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int id, QualificationDto qualificationRequest)
        {
            if (_context.Qualifications == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification table was found." });
            }

            Qualification? qualification = await _context.Qualifications.FindAsync(id);

            if (qualification == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification was found." });
            }

            qualification.Name = qualificationRequest.Name;
            qualification.Description = qualificationRequest.Description;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            if (_context.Qualifications == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification table was found." });
            }

            Qualification? qualification = await _context.Qualifications.FindAsync(id);

            if (qualification == null)
            {
                return NotFound(new ErrorMessage() { Message = "No qualification was found." });
            }

            int therepuetsCount = await _context.TherepuetsQualifications.Where(tq => tq.QualificationId == id).CountAsync();

            if(therepuetsCount > 0)
            {
                return BadRequest(new ErrorMessage() { Message = "The qualification cannot be deleted." });
            }

            _context.Qualifications.Remove(qualification);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
