import { Tyley } from './tyley';
import { BuildCommand } from './commands/build';
import { VersionCommand } from './commands/version';
import { InstallCommand } from './commands/install';
import { UninstallCommand } from './commands/uninstall';
import { HelpCommand } from './commands/help';
import { PublishCommand } from './commands/publish';
import { SearchCommand } from './commands/search';

// Add the available commands
const commands = [
  BuildCommand,
  VersionCommand,
  InstallCommand,
  UninstallCommand,
  HelpCommand,
  PublishCommand,
  SearchCommand,
];

// Create a new instance of Tyley
const tyley = new Tyley();

// Register the commands with Tyley
tyley.registerCommands(commands);

// Start the Tyley CLI
tyley.start();
