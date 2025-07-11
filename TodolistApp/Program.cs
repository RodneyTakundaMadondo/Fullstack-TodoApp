using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using To_do_List_App.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options => { 
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; 
    });
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IUserPreferenceRepository,UserPreferenceRepository>();

//builder.Services.AddDbContext<TaskDbContext>(options =>
//{
//    options.UseNpgsql(
//        builder.Configuration["ConnectionStrings:ToDoAppDbContextConnection"]);
//});
builder.Services.AddDbContext<TaskDbContext>(options =>
{
    var conn = builder.Configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(conn))
        throw new InvalidOperationException("Connection string is missing!");

    options.UseNpgsql(conn);
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.Use(async (context, next) =>
{
    if (!context.Request.Cookies.ContainsKey("UserToken"))
    {
        var token = Guid.NewGuid().ToString();
        context.Response.Cookies.Append("UserToken", token, new CookieOptions
        {
            Expires = DateTimeOffset.UtcNow.AddYears(1),
            IsEssential = true
        });
    }
    await next.Invoke();
});


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
app.Urls.Clear();
app.Urls.Add($"http://*:{port}");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TaskDbContext>();
    db.Database.Migrate();
}
app.MapGet("/debug-conn", (IConfiguration config) =>
    config.GetConnectionString("DefaultConnection") ?? "NO CONNECTION STRING");


app.Run();
