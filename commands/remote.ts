import * as childProcess from 'child_process';

interface Command {

  command: string;

  description?: string;

}

interface RemoteCommands {

  [name: string]: Command;

}

interface RemoteConfig {

  host: string;

  user: string;

  port?: number;

  remoteDir: string;

  commands: RemoteCommands;

}

function runCommand(command: string): void {

  const child = childProcess.spawnSync(command, { shell: true, stdio: 'inherit' });

  if (child.error) {

    console.error(`[!] Error running command '${command}':`, child.error);

    process.exit(1);

  }

  if (child.status !== 0) {

    console.error(`[!] Command '${command}' failed with status code ${child.status}`);

    process.exit(1);

  }

}

function runRemoteCommand(config: RemoteConfig, commandName: string): void {

  const command = config.commands[commandName];

  if (!command) {

    console.error(`[!] Command '${commandName}' not found in remote commands`);

    process.exit(1);

  }

  const sshCommand = [

    `ssh ${config.user}@${config.host}`,

    config.port ? `-p ${config.port}` : '',

    `"cd ${config.remoteDir} && ${command.command}"`

  ].join(' ');

  console.log(`[...] Running command '${command.command}' on remote host '${config.host}'`);

  runCommand(sshCommand);

}

const config: RemoteConfig = {

  host: 'edit.typeacode.com',

  user: 'host@ssh',

  port: 22,

  remoteDir: '/home/myuser/myproject',

  commands: {

    deploy: {

      command: 'npm run build && rsync -avz ./dist/ example.com:/var/www/myproject',

      description: 'Deploy the project to the remote host'

    },

    restart: {

      command: 'sudo systemctl restart myproject',

      description: 'Restart the project on the remote host'

    }

  }

};

const commandName = process.argv[2];

if (!commandName) {

  console.error('[...] Please specify a command to run on the remote host');

  process.exit(1);

}

runRemoteCommand(config, commandName);

