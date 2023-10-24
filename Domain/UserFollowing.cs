using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserFollowing
    {
        public string ObeserverId { get; set; }
        public AppUser Observer { get; set; }
        public string TargetId { get; set; }
        public AppUser Target { get; set; }
    }
}