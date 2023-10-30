using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<PagedList<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
            public PagingParams Params { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<PagedList<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }
            public async Task<Result<PagedList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                .OrderBy(d => d.Date)
                .Where(x => x.Attendees.Any(a => a.AppUser.UserName == request.Username))
                .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

                if (request.Predicate == "past")
                {
                    query = query.Where(x => x.Date < DateTime.UtcNow);
                }
                else if (request.Predicate == "future")
                {
                    query = query.Where(x => x.Date >= DateTime.UtcNow);
                }
                else if (request.Predicate == "hosting")
                {
                    query = query.Where(x => x.HostUsername == request.Username);
                }

                return Result<PagedList<UserActivityDto>>.Success(
                    await PagedList<UserActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }

    }

}