namespace To_do_List_App.Models
{
    public interface ITaskRepository
    {
        IEnumerable<ToDoTask> AllTasks { get; }
        IEnumerable<ToDoTask> ActiveTasks { get; }
        void AddTask(ToDoTask task);
        void RemoveTask(ToDoTask task);
        Task RemoveCompleted(IEnumerable<ToDoTask> tasks);
        Task UpdateTask(ToDoTask task);

    }
}
