using AutoMapper;
using Connect_Backend.Dtos;
using Connect_Backend.Models;

namespace Connect_Backend.Mapper
{
    public class HomeworkToHomeworkDto : Profile
    {
        public HomeworkToHomeworkDto()
        {
            CreateMap<Homework, HomeworkDto>();
        }
    }
}
