using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectFourServer.Managers;
using ConnectFourServer.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace ConnectFourServer
{
    public class Startup
    {
        private ConnectionsManager _manager;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // add connections manager
            services.AddSingleton<ConnectionsManager>();
            
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ConnectFourServer", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var hostAppLifetime = app.ApplicationServices.GetRequiredService<IHostApplicationLifetime>();
            hostAppLifetime.ApplicationStopping.Register(OnShutDown);

            _manager = app.ApplicationServices.GetRequiredService<ConnectionsManager>();

            app.UseWebSockets();
            // use created middleware
            app.UseMiddleware<ServerMiddleware>();

            app.Run(async context => await context.Response.WriteAsync("Connected"));
        }

        public void OnShutDown()
        {
            if(_manager != null)
            {
                _manager.CloseAllConnections();
            }            
        }
    }
}
