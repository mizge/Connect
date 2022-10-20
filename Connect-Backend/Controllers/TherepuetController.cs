using AutoMapper;
using Connect_Backend.Data;
using Connect_Backend.Dtos;
using Connect_Backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
        [HttpGet("qualifications/{qualificationId}/therepuets", Name ="GetTherepuetsByQualification")]
        public async Task<IActionResult> GetAll(int qualificationId, [FromQuery] TherepuetSearchParameters searchParameters)
        {
            if (_context.Therepuets == null)
            {
                return NotFound(new ErrorMessage() { Message = "No therepuet table was found." });
            }

            IQueryable<TherepuetDto> therepuets = _context.TherepuetsQualifications
                                                        .Where(x => x.QualificationId == qualificationId)
                                                        .Include(x => x.Therepuet)
                                                        .Include( t => t.Therepuet.User)
                                                        .Select(x => x.Therepuet)
                                                        .Select(t => _mapper.Map<TherepuetDto>(t))
                                                        .AsQueryable();

            if (!therepuets.Any())
            {
                return NotFound(new ErrorMessage() { Message = "No therepuets for this qualification was found." });
            }

            PagedList<TherepuetDto> pagedTherepuets = await PagedList<TherepuetDto>.CreateAsync(therepuets, searchParameters.PageNumber, searchParameters.PageSize);

            if (pagedTherepuets.Count < 1)
            {
                return NotFound(new ErrorMessage() { Message = "No therepuets in this page." });
            }

            string? previousPageLink = pagedTherepuets.HasPrevious ? CreateTopicsResourceUri(searchParameters, ResourceUriType.PreviousPage) : null;
            string? nextPageLink = pagedTherepuets.HasNext ?
                CreateTopicsResourceUri(searchParameters,
                    ResourceUriType.NextPage) : null;

            var paginationMetadata = new
            {
                totalCount = pagedTherepuets.TotalCount,
                pageSize = pagedTherepuets.PageSize,
                currentPage = pagedTherepuets.CurrentPage,
                totalPages = pagedTherepuets.TotalPages,
                previousPageLink,
                nextPageLink
            };

            Response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationMetadata));
            return Ok(pagedTherepuets);
        }

        [HttpGet("qualifications/{qualificationId}/therepuets/{therepuetId}")]
        public async Task<IActionResult> Get(int qualificationId, int therepuetId)
        {
            if (_context.Therepuets == null)
            {
                return NotFound(new ErrorMessage() { Message = "No therepuet table was found." });
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
                return NotFound(new ErrorMessage() { Message = "No such therepuet for this qualification was found." });
            }

            return Ok(therepuet);
        }

        private string? CreateTopicsResourceUri(TherepuetSearchParameters topicSearchParametersDto, ResourceUriType type)
        {
            return type switch
            {
                ResourceUriType.PreviousPage => Url.Link("GetTherepuetsByQualification",
                    new
                    {
                        pageNumber = topicSearchParametersDto.PageNumber - 1,
                        pageSize = topicSearchParametersDto.PageSize,
                    }),
                ResourceUriType.NextPage => Url.Link("GetTherepuetsByQualification",
                    new
                    {
                        pageNumber = topicSearchParametersDto.PageNumber + 1,
                        pageSize = topicSearchParametersDto.PageSize,
                    }),
                _ => Url.Link("GetTherepuetsByQualification",
                    new
                    {
                        pageNumber = topicSearchParametersDto.PageNumber,
                        pageSize = topicSearchParametersDto.PageSize,
                    })
            };
        }
    }
}
