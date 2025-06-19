namespace To_do_List_App.Models
{
    public class ToDoTask
    {
        public int ToDoTaskId { get; set; }
        public string TaskDescription {  get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? UserToken {  get; set; }
        public string? UserTheme {  get; set; }
    }
}
