using System.ComponentModel.DataAnnotations;

namespace To_do_List_App.Models
{
    public class UserPreference
    {
        [Key]
        public int PreferenceId { get; set; }
        public string? UserToken {  get; set; }
        public string Theme {  get; set; } = string.Empty;
        public List<ToDoTask>? Tasks { get; set; }

    }
}
