using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DeveloperAssessment.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DeveloperAssessment.Data
{
    public class ApplicationDbContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public ApplicationDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// Override to allow for configuring the database options
        /// </summary>
        /// <param name="options"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sqlite database
            options.UseSqlite(Configuration.GetConnectionString("SqliteDb"));
        }

        /// <summary>
        /// Overrode the model creating method to manually define data model relationships for entity classes
        /// Manually configured the table names using toTable("")
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Map entity name to DB Table name
            modelBuilder.Entity<TimesRecord>().ToTable("Articles");

            //map property to column specifying not required
            modelBuilder.Entity<TimesRecord>().Property(m => m.Name).IsRequired(false);
            modelBuilder.Entity<TimesRecord>().Property(m => m.Views).IsRequired(false);
            modelBuilder.Entity<TimesRecord>().Property(m => m.Section).IsRequired(false);
            modelBuilder.Entity<TimesRecord>().Property(m => m.SubSection).IsRequired(false);
            modelBuilder.Entity<TimesRecord>().Property(m => m.Link).IsRequired(false);
            modelBuilder.Entity<TimesRecord>().Property(m => m.Title).IsRequired(false);
            modelBuilder.Entity<TimesRecord>().Property(m => m.PublishedDate);
        }

        /// <summary>
        /// DbSet for times records
        /// </summary>
        public DbSet<TimesRecord> Times { get; set; }


    }
}
