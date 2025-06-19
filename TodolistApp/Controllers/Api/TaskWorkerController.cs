using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using To_do_List_App.Models;

namespace To_do_List_App.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskWorkerController : ControllerBase
    {
        private readonly  ITaskRepository _taskRepository;
        private readonly IUserPreferenceRepository _userPreferenceRepository;
        public TaskWorkerController(ITaskRepository taskRepository, IUserPreferenceRepository userPreferenceRepository)
        {
            _taskRepository = taskRepository;
            _userPreferenceRepository = userPreferenceRepository;
        }
        [HttpGet]
        public IActionResult AllNotes()
        {
            var token = Request.Cookies["UserToken"];

            var tasks = _taskRepository.AllTasks.Where(t => t.UserToken == token );
            
            return Ok(tasks);
        }
        [HttpGet("get-active")]
        public IActionResult AllActiveTasks()
        {
            var token = Request.Cookies["UserToken"];
            var activeTasks = _taskRepository.ActiveTasks.Where(t => t.UserToken == token);
            return Ok(activeTasks);
        }
        [HttpGet("get-settings")]
        public IActionResult SetupTheme()
        {
            var token = Request.Cookies["UserToken"];
            var userPreferences = _userPreferenceRepository.AllPreferences.FirstOrDefault(p => p.UserToken == token);
            if (userPreferences == null) return BadRequest();
            return Ok(userPreferences);
        }

        [HttpPost]
        public IActionResult Create([FromBody]string? taskDescription)
        {
            var token = Request.Cookies["UserToken"];

            if (string.IsNullOrEmpty(taskDescription))
            {
                return BadRequest("Task is required. ");
            }

            var task = new ToDoTask
            {
                TaskDescription = taskDescription,
                IsActive = true,
                UserToken = token
            };

            _taskRepository.AddTask(task);
            return Ok(task);
        }
        [HttpDelete]
        public IActionResult Delete([FromBody] int taskId)
        {
            var token = Request.Cookies["UserToken"];
            var task = _taskRepository.AllTasks.FirstOrDefault(t=> t.ToDoTaskId == taskId && t.UserToken == token);
            if (task == null)
            {
                return BadRequest("Task does not exist");
            } 
            _taskRepository.RemoveTask(task);
            return Ok(task);

        }

        [HttpDelete("remove-completed")]
        public async Task<IActionResult> RemoveCompletedTasks()
        {
            var token = Request.Cookies["UserToken"];
            var tasks = _taskRepository.AllTasks.Where(t=>t.UserToken == token && t.IsActive == false).ToList();
            if (!tasks.Any()) return BadRequest("The tasks you are looking for do not exist");

            await _taskRepository.RemoveCompleted(tasks);
            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateIsActive([FromBody]  UpdateIsActiveDto dto )
        {
            var token = Request.Cookies["UserToken"];
            var task = _taskRepository.AllTasks.FirstOrDefault(t=>t.ToDoTaskId ==dto.Id && t.UserToken == token );
            if (task == null) return BadRequest();
            task.IsActive = dto.IsActive;

           await _taskRepository.UpdateTask(task);
           var activeTasks = _taskRepository.ActiveTasks.Where(t=> t.UserToken==token);
            return Ok(activeTasks);

        }

        [HttpPost("set-theme")]
        public IActionResult SetTheme([FromBody] UpdateThemeDto dto)
        {

            var token = Request.Cookies["UserToken"];
            if (token == null) return BadRequest("Something is wrong with the token");
            if (dto.Theme == null) return BadRequest("No data here");
            _userPreferenceRepository.SetTheme(token, dto);
            return Ok();


        }



    }
}
