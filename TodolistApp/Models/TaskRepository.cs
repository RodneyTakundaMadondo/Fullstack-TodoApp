namespace To_do_List_App.Models
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TaskDbContext _context;
        public TaskRepository(TaskDbContext context)
        {
            _context = context;
        }
        public IEnumerable<ToDoTask> AllTasks
        {
            get
            {
                return _context.ToDoTasks;
            }
        }
        public IEnumerable<ToDoTask> ActiveTasks
        {
            get
            {
                return _context.ToDoTasks.Where(t => t.IsActive);
            }
        }
        public void AddTask(ToDoTask task)
        {
            _context.ToDoTasks.Add(task);
            _context.SaveChanges();
        }

        public void RemoveTask(ToDoTask task)
        {
            _context.ToDoTasks.Remove(task);
            _context.SaveChanges();
        }
        public async Task RemoveCompleted(IEnumerable<ToDoTask> tasks)
        {
            _context.ToDoTasks.RemoveRange(tasks);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateTask(ToDoTask task)
        {
            _context.ToDoTasks.Update(task);
            await _context.SaveChangesAsync();
        }
    }
}
