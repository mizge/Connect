using Connect_Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace Connect_Backend.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
        {
            base.Database.EnsureCreated();
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Therepuet> Therepuets { get; set; }
        public DbSet<TherepuetsQualifications> TherepuetsQualifications { get; set; }
        public DbSet<Qualification> Qualifications { get; set; }
        public DbSet<Homework> Homeworks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Role>().HasKey(t => t.Id);
            builder.Entity<User>().HasOne(t => t.Role).WithMany().OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Therepuet>().HasOne(t => t.User).WithOne().OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Therepuet>().HasMany(t => t.Sessions).WithOne(s=> s.Therepuet).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Session>().HasOne(s => s.Therepuet).WithMany(t => t.Sessions).HasForeignKey(s => s.TherepuetId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Session>().HasOne(s => s.Client).WithMany().OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Session>().Property(s => s.ClientId).IsConcurrencyToken();
            builder.Entity<TherepuetsQualifications>().HasOne(x => x.Qualification).WithMany().HasForeignKey(x=>x.QualificationId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<TherepuetsQualifications>().HasOne(x => x.Therepuet).WithMany().HasForeignKey(x => x.TherepuetId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<TherepuetsQualifications>().HasKey(x => new { x.TherepuetId, x.QualificationId });
            builder.Entity<Homework>().HasOne(s => s.Session).WithMany().OnDelete(DeleteBehavior.NoAction);
        }
    }
}
