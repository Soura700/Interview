// // var builder = WebApplication.CreateBuilder(args);

// // // Add services to the container.
// // // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// // builder.Services.AddOpenApi();

// // var app = builder.Build();

// // // Configure the HTTP request pipeline.
// // if (app.Environment.IsDevelopment())
// // {
// //     app.MapOpenApi();
// // }

// // app.UseHttpsRedirection();

// // var summaries = new[]
// // {
// //     "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
// // };

// // app.MapGet("/weatherforecast", () =>
// // {
// //     var forecast =  Enumerable.Range(1, 5).Select(index =>
// //         new WeatherForecast
// //         (
// //             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
// //             Random.Shared.Next(-20, 55),
// //             summaries[Random.Shared.Next(summaries.Length)]
// //         ))
// //         .ToArray();
// //     return forecast;
// // })
// // .WithName("GetWeatherForecast");

// // app.Run();

// // record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// // {
// //     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// // }

// var builder = WebApplication.CreateBuilder(args);

// // ✅ Add Swagger/OpenAPI services
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();


// var app = builder.Build();

// // ✅ Enable Swagger only in development mode
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();


// app.Run();


using backend.Interfaces;
using backend.Services;
using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IInterviewerService, InterviewerService>();
builder.Services.AddScoped<ICandidateService, CandidateService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IInterviewerAssignmentService, InterviewerAssignmentService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()     // ⚠️ Allow all origins (not recommended in production)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Manual CORS Middleware — Applies to every request



var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:4200");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests (OPTIONS)
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }

    await next();
});

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.MapControllers();
app.Run();
