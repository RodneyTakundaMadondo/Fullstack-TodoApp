namespace To_do_List_App.Models
{
    public class UserPreferenceRepository :IUserPreferenceRepository
    {
        private readonly TaskDbContext _context;
        public UserPreferenceRepository(TaskDbContext context)
        {
            _context = context;
        }

        public IEnumerable<UserPreference> AllPreferences
        {
            get
            {
                return _context.UserPreferences;
            }
        }
        public void AddPreference(UserPreference userPreference)
        {
            _context.UserPreferences.Add(userPreference);
            _context.SaveChanges();
        }
        public void SetTheme(string _UserToken, UpdateThemeDto dto)
        {
            var preference = _context.UserPreferences.FirstOrDefault(p => p.UserToken == _UserToken);
            if (preference == null)
            {//first time
                var Theme = new UserPreference
                {
                    UserToken = _UserToken,
                    Theme = dto.Theme,
                };
                AddPreference(Theme);
            }
            else
            {
                //already set the theme before
                preference.Theme = dto.Theme;
                _context.SaveChanges();

            }
            
        }
    }
}
