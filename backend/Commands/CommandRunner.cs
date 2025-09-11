namespace OldenEraFanSite.Api.Commands;

public class CommandRunner
{
    private readonly IServiceProvider _serviceProvider;
    private readonly Dictionary<string, Func<IServiceProvider, ICommand>> _commands;

    public CommandRunner(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        _commands = new Dictionary<string, Func<IServiceProvider, ICommand>>
        {
            ["regenerate-thumbnails"] = sp => new RegenerateThumbnailsCommand(sp),
            ["list-media"] = sp => new ListMediaCommand(sp),
            ["cleanup-thumbnails"] = sp => new CleanupThumbnailsCommand(sp)
        };
    }

    public async Task<int> RunAsync(string[] args)
    {
        if (args.Length == 0)
        {
            ShowAvailableCommands();
            return 1;
        }

        var commandName = args[0].ToLower();

        if (commandName == "help" || commandName == "--help" || commandName == "-h")
        {
            ShowAvailableCommands();
            return 0;
        }

        if (!_commands.ContainsKey(commandName))
        {
            Console.WriteLine($"❌ Unknown command: {commandName}");
            ShowAvailableCommands();
            return 1;
        }

        try
        {
            var command = _commands[commandName](_serviceProvider);
            var commandArgs = args.Skip(1).ToArray();
            
            Console.WriteLine($"🚀 Executing command: {commandName}");
            Console.WriteLine();
            
            return await command.ExecuteAsync(commandArgs);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"💥 Command execution failed: {ex.Message}");
            return 1;
        }
    }

    private void ShowAvailableCommands()
    {
        Console.WriteLine("🛠️  OldenEra Fan Site CLI Tools");
        Console.WriteLine();
        Console.WriteLine("Usage: dotnet run -- <command> [options]");
        Console.WriteLine();
        Console.WriteLine("Available commands:");
        
        using var scope = _serviceProvider.CreateScope();
        
        foreach (var kvp in _commands)
        {
            var command = kvp.Value(_serviceProvider);
            Console.WriteLine($"  {command.Name.PadRight(20)} {command.Description}");
        }
        
        Console.WriteLine();
        Console.WriteLine("For help with a specific command, use:");
        Console.WriteLine("  dotnet run -- <command> --help");
    }
}