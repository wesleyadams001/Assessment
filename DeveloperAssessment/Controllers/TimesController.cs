using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DeveloperAssessment.Data;
using DeveloperAssessment.Models;

namespace DeveloperAssessment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger _logger;

        public TimesController(ILogger<TimesController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Get time records
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="sortColumn"></param>
        /// <param name="sortOrder"></param>
        /// <param name="filterColumn"></param>
        /// <param name="filterQuery"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ApiResult<TimesRecord>>> GetTimesRecords(
                int pageIndex = 0,
                int pageSize = 10,
                string? sortColumn = null,
                string? sortOrder = null,
                string? filterColumn = null,
                string? filterQuery = null)
        {
            return await ApiResult<TimesRecord>.CreateAsync(
                    _context.Times.Select(c => new TimesRecord()
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Title = c.Title,
                        Section = c.Section,
                        Views = c.Views,
                        Link = c.Link
                    }),
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<TimesRecord>> GetTimesRecord(int id)
        {
            var country = await _context.Times.FindAsync(id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }


        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(
            int countryId,
            string fieldName,
            string fieldValue)
        {
            
            return (ApiResult<TimesRecord>.IsValidProperty(fieldName, true))
                ? _context.Times.Any(
                    String.Format("{0} == @0 && Id != @1", fieldName),
                    fieldValue,
                    countryId)
                : false;
        }
    }
}
