using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.Services.EFCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

builder.Services.AddScoped<EFUserService>();
builder.Services.AddScoped<EFProductService>();
builder.Services.AddScoped<EFBranchService>();
builder.Services.AddScoped<ModuleCategoryService>();
builder.Services.AddScoped<EFModuleService>();
builder.Services.AddScoped<EFProcDeptService>();
builder.Services.AddScoped<EFStatusService>();
builder.Services.AddScoped<EFRoleService>();
builder.Services.AddScoped<EFContractTypeService>();


builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opt =>
    {
        opt.LoginPath = "/Account/Login";
        opt.LogoutPath = "/Account/Logout";
        opt.AccessDeniedPath = "/Account/AccessDenied";
        opt.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        opt.SlidingExpiration = true;
    });
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

//app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Products}/{action=Index}/{id?}");


app.Run();
