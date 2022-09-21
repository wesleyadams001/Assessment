using DeveloperAssessment.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DeveloperAssessment.Data
{
    public class Parser
    {
        /// <summary>
        /// Lets parse some json using newtonsoft
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public static IEnumerable<TimesRecord> Parse(string json)
        {
            //create a JObject from associted json string
            var value = JObject.Parse(json);

            //get a value using the dictionary like syntax
            value.TryGetValue("results", out var results);
            
            //If its not null send to Ienumerable of TimesRecords
            if (results != null)
            {
                return results?.ToObject<IEnumerable<TimesRecord>>()! ;
            }
            else
            {
                return Enumerable.Empty<TimesRecord>();
            }
        }
    }
}
