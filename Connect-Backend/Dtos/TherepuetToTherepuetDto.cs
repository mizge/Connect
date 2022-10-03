using AutoMapper;
using Connect_Backend.Models;

namespace Connect_Backend.Dtos
{
    public class TherepuetToTherepuetDto : Profile
    {
        public TherepuetToTherepuetDto()
        {
            CreateMap<Therepuet, TherepuetDto>();
        }
    }
}
