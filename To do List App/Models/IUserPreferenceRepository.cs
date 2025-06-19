namespace To_do_List_App.Models
{
    public interface IUserPreferenceRepository
    {
        IEnumerable<UserPreference> AllPreferences { get; }
        void AddPreference(UserPreference userPreference);
        void SetTheme(string _UserToken, UpdateThemeDto dto);

    }
}
