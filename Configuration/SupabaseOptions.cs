namespace ModernToolRequestManager.Configuration;

public sealed class SupabaseOptions
{
    public const string SectionName = "Supabase";
    
    public required string Url { get; init; }
    public required string AnonKey { get; init; }
}
