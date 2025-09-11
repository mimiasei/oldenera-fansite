namespace OldenEraFanSite.Api.Commands;

public interface ICommand
{
    string Name { get; }
    string Description { get; }
    Task<int> ExecuteAsync(string[] args);
}

public class CommandResult
{
    public int ExitCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool Success => ExitCode == 0;
}