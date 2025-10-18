using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.Filters
{
    public class ValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(new
                {
                    Status = 400,
                    Message = "Validation error",
                    Errors = context.ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new { Field = x.Key, Error = x.Value?.Errors.First().ErrorMessage })
                });
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
