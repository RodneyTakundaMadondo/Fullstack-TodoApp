using To_do_List_App.Models;
namespace To_do_List_App.ViewModels
{
    public class ToDoListViewModel
    {
        public IEnumerable<ToDoTask> ToDoTasks { get; }
        public ToDoListViewModel(IEnumerable<ToDoTask> tasks)
        {
            ToDoTasks = tasks;
        }

    }
}
