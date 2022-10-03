using AutoMapper;
using Connect_Backend.Dtos;
using Connect_Backend.Models;

namespace Connect_Backend.Mapper
{
    public class SessionToTherepuetSessionDto : Profile
    {
        public SessionToTherepuetSessionDto()
        {
            CreateMap<Session, TherepuetSessionDto>();
        }
    }
}
