using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace backend.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            int statusCode = 500;

            if (context.Exception is BadHttpRequestException badRequestEx)
            {
                statusCode = badRequestEx.StatusCode;
            }

            var response = new
            {
                status = statusCode,
                message = "An error occurred.",
                detail = context.Exception.Message
            };

            context.Result = new ObjectResult(response) { StatusCode = statusCode };
            context.ExceptionHandled = true;
        }
    }
}
