using Microsoft.AspNetCore.Mvc;
using To_do_List_App.Models;
using To_do_List_App.ViewModels;

namespace To_do_List_App.Controllers
{
    public class HomeController : Controller
    {
        private readonly ITaskRepository _taskRepository;
        public HomeController(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }
        public IActionResult Index()
        {
            var token = Request.Cookies["UserToken"];
            ToDoListViewModel viewModel = new ToDoListViewModel(_taskRepository.AllTasks.Where(t => t.UserToken == token));
            return View(viewModel);
        }
        //.Where(t =>t.UserToken == token)
    }
}
