// // using backend.Interfaces;
// // using backend.Services;
// // using backend.Data;
// // using backend.Hubs;
// // using Microsoft.EntityFrameworkCore;

// // var builder = WebApplication.CreateBuilder(args);

// // var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// // builder.Services.AddDbContext<AppDbContext>(options =>
// //     options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// // builder.Services.AddScoped<IInterviewerService, InterviewerService>();
// // builder.Services.AddScoped<ICandidateService, CandidateService>();
// // builder.Services.AddScoped<IEmailService, EmailService>();
// // builder.Services.AddScoped<IAdminService, AdminService>();
// // builder.Services.AddScoped<IInterviewerAssignmentService, InterviewerAssignmentService>();
// // builder.Services.AddScoped<IVideoMeetingService, VideoMeetingService>();

// // // Add SignalR
// // builder.Services.AddSignalR();



// // builder.Services.AddControllers();
// // builder.Services.AddEndpointsApiExplorer();
// // builder.Services.AddSwaggerGen();

// // builder.Services.AddCors(options =>
// // {
// //     options.AddDefaultPolicy(policy =>
// //     {
// //         policy.WithOrigins("http://localhost:4200")
// //               .AllowAnyMethod()
// //               .AllowAnyHeader()
// //               .WithExposedHeaders("Content-Disposition")
// //               .SetIsOriginAllowed(_ => true) // Allow localhost dev
// //               .AllowCredentials();
// //     });
// // });


// // // Manual CORS Middleware — Applies to every request



// // var app = builder.Build();

// // app.Use(async (context, next) =>
// // {
// //     context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:4200");
// //     context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
// //     context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
// //     context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");

// //     // Handle preflight requests (OPTIONS)
// //     if (context.Request.Method == "OPTIONS")
// //     {
// //         context.Response.StatusCode = 200;
// //         await context.Response.CompleteAsync();
// //         return;
// //     }

// //     await next();
// // });



// // if (app.Environment.IsDevelopment())
// // {
// //     app.UseSwagger();
// //     app.UseSwaggerUI();
// // }

// // app.UseCors();
// // app.UseStaticFiles();
// // app.UseRouting();
// // app.MapControllers();

// // app.MapHub<VideoCallHub>("/videomeetinghub");


// // app.Run();



// using backend.Interfaces;
// using backend.Services;
// using backend.Data;
// using backend.Hubs;
// using Microsoft.EntityFrameworkCore;

// var builder = WebApplication.CreateBuilder(args);

// // 🔹 Database Configuration
// var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// // 🔹 Dependency Injection
// builder.Services.AddScoped<IInterviewerService, InterviewerService>();
// builder.Services.AddScoped<ICandidateService, CandidateService>();
// builder.Services.AddScoped<IEmailService, EmailService>();
// builder.Services.AddScoped<IAdminService, AdminService>();
// builder.Services.AddScoped<IInterviewerAssignmentService, InterviewerAssignmentService>();
// builder.Services.AddScoped<IVideoMeetingService, VideoMeetingService>();

// // 🔹 SignalR
// builder.Services.AddSignalR();

// // 🔹 Controllers + Swagger
// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // 🔹 CORS Configuration
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend", policy =>
//     {
//         policy.WithOrigins("http://localhost:4200")
//               .AllowAnyHeader()
//               .AllowAnyMethod()
//               .AllowCredentials()
//               .WithExposedHeaders("Content-Disposition")
//               .SetIsOriginAllowed(_ => true);
//     });
// });

// var app = builder.Build();

// // 🔹 Middleware Order (very important!)
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseStaticFiles();
// app.UseRouting();

// // ✅ Apply the proper CORS policy globally
// app.UseCors("AllowFrontend");

// // 🔹 Map Controllers + SignalR Hubs
// app.MapControllers();
// app.MapHub<VideoCallHub>("/videomeetinghub");

// app.Run();

using backend.Interfaces;
using backend.Services;
using backend.Data;
using backend.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<IInterviewerService, InterviewerService>();
builder.Services.AddScoped<ICandidateService, CandidateService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IInterviewerAssignmentService, InterviewerAssignmentService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IVideoMeetingService, VideoMeetingService>();
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<ICandidateAuthService, CandidateAuthService>();
builder.Services.AddScoped<IInterviewerAuthService, InterviewerAuthService>();

// Add SignalR
builder.Services.AddSignalR();

// Configure CORS properly
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// =====================================================
// ✅ ADD JWT AUTHENTICATION  (ONLY ADDING, NOT CHANGING)
// =====================================================
// builder.Services.AddAuthentication("JwtAuth")
// .AddJwtBearer("JwtAuth", options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidateLifetime = true,
//         ValidateIssuerSigningKey = true,
//         ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
//         ValidAudience = builder.Configuration["JwtSettings:Audience"],
//         IssuerSigningKey = new SymmetricSecurityKey(
//             Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])
//         )
//     };

//     // Required for cookie-based JWT
//     options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
//     {
//         OnMessageReceived = context =>
//         {
//             if (context.Request.Cookies.ContainsKey("admin_token"))
//             {
//                 context.Token = context.Request.Cookies["admin_token"];
//             }
//             if (context.Request.Cookies.ContainsKey("candidate_token"))
//             {
//                 context.Token = context.Request.Cookies["candidate_token"];
//             }

//             return Task.CompletedTask;
//         }
//     };
// });

// builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = null;
    options.DefaultChallengeScheme = null;
})

    // ADMIN JWT VALIDATION
    .AddJwtBearer("AdminScheme", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtAdmin:Issuer"],
            ValidAudience = builder.Configuration["JwtAdmin:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtAdmin:Key"])
            )
        };

        // read token from admin cookie
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["admin_token"];
                return Task.CompletedTask;
            }
        };
    })

        .AddJwtBearer("InterviewerScheme", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtInterviewer:Issuer"],
            ValidAudience = builder.Configuration["JwtInterviewer:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtInterviewer:Key"])
            )
        };

        // read token from admin cookie
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["interviewer_token"];
                return Task.CompletedTask;
            }
        };
    })

    // CANDIDATE JWT VALIDATION
    .AddJwtBearer("CandidateScheme", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtCandidate:Issuer"],
            ValidAudience = builder.Configuration["JwtCandidate:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtCandidate:Key"])
            )
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["candidate_token"];
                return Task.CompletedTask;
            }
        };


    });




// builder.Services.AddAuthorization();
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = null;
//     options.DefaultChallengeScheme = null;
// });
// =====================================================

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseRouting();

// Use CORS before endpoints
app.UseCors("AllowAngular");

// =====================================================
// ✅ ADD AUTHENTICATION + AUTHORIZATION MIDDLEWARE
// =====================================================
app.UseAuthentication();
app.UseAuthorization();
// =====================================================

// Important: Map Hub before running
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<VideoCallHub>("/videomeetinghub");
});

app.Run();
