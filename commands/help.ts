import { Command } from '../tyley';

export class HelpCommand implements Command {
  public readonly name = 'help';
  public readonly description = 'Displays a list of available commands or help for a specific command';
  public readonly usage = 'tyley help [command]';

  public execute(args: string[]): void {
    if (args.length > 0) {
      // Show help for a specific command
      const commandName = args[0];
      const command = Tyley.getCommand(commandName);

      if (!command) {
        console.log(`Command "${commandName}" not found`);
        return;
      }

      console.log(`Usage: ${command.usage}`);
      console.log(`Description: ${command.description}`);
    } else {
      // Show list of available commands
      const commands = Tyley.getCommands();

      console.log('Available commands:');
      console.log(commands.map(command => `${command.name} - ${command.description}`).join('\n'));
    }
  }
}
