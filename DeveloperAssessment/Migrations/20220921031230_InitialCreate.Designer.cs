﻿// <auto-generated />
using DeveloperAssessment.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DeveloperAssessment.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20220921031230_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.9");

            modelBuilder.Entity("DeveloperAssessment.Models.TimesRecord", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Link")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Section")
                        .HasColumnType("TEXT");

                    b.Property<string>("SubSection")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.Property<string>("Views")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Articles", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
