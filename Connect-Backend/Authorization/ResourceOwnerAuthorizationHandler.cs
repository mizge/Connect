using Connect_Backend.Authorization.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace Connect_Backend.Authorization
{
    public class ResourceOwnerAuthorizationHandler : AuthorizationHandler<ResourceOwnerRequirement, ITherepuetOwnedResource>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ResourceOwnerRequirement requirement, ITherepuetOwnedResource resource)
        {
            if (int.Parse(context.User.Claims.First(x => x.Type == ClaimTypes.Sid).Value) == resource.TherepuetId)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
    public record ResourceOwnerRequirement : IAuthorizationRequirement;
}
