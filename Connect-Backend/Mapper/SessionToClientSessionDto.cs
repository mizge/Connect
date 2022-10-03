using AutoMapper;
using Connect_Backend.Dtos;
using Connect_Backend.Models;

namespace Connect_Backend.Mapper
{
    public class SessionToClientSessionDto : Profile
    {
        public SessionToClientSessionDto()
        {
            CreateMap<Session, ClientSessionDto>();
        }
    }
}
