using Application.Core;

namespace Application.Profiles
{
    public class PorfileActivitiesParams : PagingParams
    {

        public string Predicate { get; set; }
        public string Username { get; set; }
    }
}