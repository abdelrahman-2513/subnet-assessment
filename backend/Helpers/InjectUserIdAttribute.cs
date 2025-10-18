namespace backend.Configs
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using System.Security.Claims;

    public class InjectUserIdAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;
            var userIdClaim = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdClaim, out var userId))
            {
                    context.ActionArguments["userId"] = userId;
            }

            base.OnActionExecuting(context);
        }
    }

}
