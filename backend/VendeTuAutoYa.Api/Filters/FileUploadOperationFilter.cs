using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace VendeTuAutoYa.Api.Filters
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileUploadMime = "multipart/form-data";
            if (operation.RequestBody?.Content?.ContainsKey(fileUploadMime) == true)
            {
                var fileParams = context.MethodInfo.GetParameters()
                    .Where(p => p.ParameterType == typeof(IFormFile) || p.ParameterType == typeof(IFormFile[]))
                    .ToList();

                if (fileParams.Any())
                {
                    var uploadFileMediaType = operation.RequestBody.Content[fileUploadMime];
                    
                    foreach (var param in fileParams)
                    {
                        uploadFileMediaType.Schema.Properties[param.Name!] = new OpenApiSchema()
                        {
                            Type = "string",
                            Format = "binary"
                        };
                    }
                }
            }
            
            // Manejo específico para el atributo [Consumes("multipart/form-data")]
            var consumesAttribute = context.MethodInfo.GetCustomAttribute<ConsumesAttribute>();
            if (consumesAttribute?.ContentTypes?.Contains(fileUploadMime) == true)
            {
                if (operation.RequestBody == null)
                {
                    operation.RequestBody = new OpenApiRequestBody();
                }

                if (!operation.RequestBody.Content.ContainsKey(fileUploadMime))
                {
                    operation.RequestBody.Content[fileUploadMime] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = new Dictionary<string, OpenApiSchema>()
                        }
                    };
                }

                var parameters = context.MethodInfo.GetParameters();
                var schema = operation.RequestBody.Content[fileUploadMime].Schema;

                foreach (var parameter in parameters)
                {
                    if (parameter.ParameterType == typeof(IFormFile))
                    {
                        schema.Properties[parameter.Name!] = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary"
                        };
                    }
                    else if (parameter.ParameterType == typeof(string))
                    {
                        schema.Properties[parameter.Name!] = new OpenApiSchema
                        {
                            Type = "string"
                        };
                    }
                }
            }
        }
    }
}