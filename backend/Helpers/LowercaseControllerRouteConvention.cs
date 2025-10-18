using Microsoft.AspNetCore.Mvc.ApplicationModels;

public class LowercaseControllerRouteConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        // Change [controller] token to lowercase
        var controllerName = controller.ControllerName.ToLowerInvariant();

        foreach (var selector in controller.Selectors)
        {
            if (selector.AttributeRouteModel != null)
            {
                selector.AttributeRouteModel.Template =
                    selector.AttributeRouteModel.Template
                        .Replace("[controller]", controllerName);
            }
        }
    }
}
