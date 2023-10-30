using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }
        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetActivities(string username, string predicate, [FromQuery] PagingParams param)
        {
            return HandlePagedResult(await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate, Params = param }));
        }

        [HttpPut]
        public async Task<IActionResult> EditProfile(string username, Profile profile)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Profile = profile }));
        }
    }
}