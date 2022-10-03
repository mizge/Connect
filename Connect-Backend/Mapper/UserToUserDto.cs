using AutoMapper;
using Connect_Backend.Dtos;
using Connect_Backend.Models;

namespace Connect_Backend.Mapper
{
    public class UserToUserDto : Profile
    {
        public UserToUserDto()
        {
            CreateMap<User, UserDto>();
        }
    }
}
