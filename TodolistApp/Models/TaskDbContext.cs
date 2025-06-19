using Microsoft.EntityFrameworkCore;

namespace To_do_List_App.Models
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options) 
        { 

        }
       public DbSet<ToDoTask> ToDoTasks { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
    }
}
