namespace Connect_Backend.Authorization.Model
{
    public static class UserRoles
    {
        public const string Admin = nameof(Admin);
        public const string Therepuet = nameof(Therepuet);
        public const string Client = nameof(Client);

        public static readonly IReadOnlyCollection<string> All = new[] { Admin, Therepuet, Client };
    }
}
