using DeveloperAssessment.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace DeveloperAssessment.Models
{
    /// <summary>
    /// A representation of a Times Record here being used with data anotation for EF and Newtonsoft 
    /// Could also use an intermediary or data transfer object (DTO) if that is preferrable
    /// </summary>
    public class TimesRecord
    {
        /// <summary>
        /// The ID
        /// </summary>
        [Key]
        public Int64 Id { get; set; }

        /// <summary>
        /// A Name that could get used
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// A section to which item belongs
        /// </summary>
        [JsonProperty("section")]
        public string? Section { get; set; }

        /// <summary>
        /// Number of views which I could not actually 
        /// locate as a property in the api perhaps I just missed it
        /// in a separate endpoint?
        /// </summary>
        public string? Views { get; set; }

        /// <summary>
        /// The article title
        /// </summary>
        [JsonProperty("title")]
        public string? Title { get; set; }

        /// <summary>
        /// The article URL to allow us to link to it from the data grid
        /// </summary>
        [JsonProperty("url")]
        public string? Link { get; set; }

        /// <summary>
        /// The subsection content if I evolve this further
        /// </summary>
        [JsonProperty("subsection")]
        public string? SubSection { get; set; }
    }
}
