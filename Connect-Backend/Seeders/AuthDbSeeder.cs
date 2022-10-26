using Azure.Core;
using Connect_Backend.Authorization.Model;
using Connect_Backend.Data;
using Connect_Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Connect_Backend.Seeders
{
    public class AuthDbSeeder
    {
        private readonly ApplicationDbContext _context;
        public AuthDbSeeder(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task SeedAsync()
        {
            await AddDefaultRoles();
            await AddAdminUser();
        }
        private async Task AddDefaultRoles()
        {
            foreach (var role in UserRoles.All)
            {
                var roleExists = await _context.Roles.FirstOrDefaultAsync(x => x.Name == role);
                if (roleExists == null)
                {
                    await _context.Roles.AddAsync(new Role() { Name = role });
                    await _context.SaveChangesAsync();
                }
            }
        }
        private async Task AddAdminUser()
        {
            var newAdminUser = new User()
            {
                Name = "admin",
                Surname = "admin",
                Email = "admin@test.com",
                RoleId = 1
            };

            var existingAdminUser = await _context.Users.FirstOrDefaultAsync(x => x.Name == newAdminUser.Name);
            if (existingAdminUser == null)
            {
                newAdminUser.Password = BCrypt.Net.BCrypt.HashPassword("password");
                var createAdminUserResult = await _context.Users.AddAsync(newAdminUser);
                await _context.SaveChangesAsync();
            }
        }
    }
}
