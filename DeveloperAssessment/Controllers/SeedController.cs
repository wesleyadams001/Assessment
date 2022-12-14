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
using System.Net.Http.Headers;

namespace DeveloperAssessment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly string _URL = "https://api.nytimes.com/svc/mostpopular/v2/viewed/30.json?api-key=hmNzQpMlkLSsTGvnR8tpAOmibGDHwicU";

        /// <summary>
        /// Seed controller
        /// </summary>
        /// <param name="context"></param>
        /// <param name="env"></param>
        public SeedController(
            ILogger<SeedController> logger,
            ApplicationDbContext context,
            IWebHostEnvironment env)
        {
            _logger = logger;
            _context = context;
            _env = env;
        }

        /// <summary>
        /// Call the New York Times API to retrieve data for last 30 days
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            HttpClient client = new HttpClient();

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

            // List data response.
            HttpResponseMessage response = await client.GetAsync(this._URL);  
            if (response.IsSuccessStatusCode)
            {
                // Parse the response body.
                var dataObjects = await response.Content.ReadAsStringAsync();

                try
                {
                    //convert to ienumerable of objects
                    var records = Parser.Parse(dataObjects);
                    var ids = records.Select(n => n.Id).ToHashSet();
                    
                    if (this._context.Times.Count() > 0)
                    {
                        //Get items and update the values based on a join of their ids and then projecting the updated sequence
                        var all = this._context.Times.ToList();
                        all = (from val1 in all
                               join val2 in records
                               on val1.Id equals val2.Id 
                               select new TimesRecord() { Id = val1.Id, Link = val2.Link, Name = val2.Name, PublishedDate = val2.PublishedDate, Section = val2.Section, SubSection = val2.SubSection, Title = val2.Title, Views = val2.Views }
                             ).ToList();

                        //update a range of values using the modified sequence
                        this._context.UpdateRange(all);
                        
                    }
                    else
                    {
                        //Adds ienumerable as range to context ensuring update of items
                        this._context.Times.AddRange(records);
                    }

                    //save changes to db
                    this._context.SaveChanges();

                    return new JsonResult(new
                    {
                        Count = records.Count()
                    });
                }
                catch(Exception e)
                {
                    this._logger.LogError($"Failed to add with error {e.Message}");
                }
                
            }
            else
            {
                //Write codes and reason phrase
                this._logger.LogInformation("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
            }


            // Dispose once all HttpClient calls are complete.
            client.Dispose();

            return base.NoContent();
        }
    }
}
