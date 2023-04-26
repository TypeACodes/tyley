import { Client, Config } from 'ssh2';

interface RemoteHostOptions {
  host: string;
  port?: number;
  username: string;
  privateKey?: string;
  password?: string;
}

class RemoteHost {
  private client: Client;
  private isConnected: boolean;

  constructor(private options: RemoteHostOptions) {
    this.client = new Client();
    this.isConnected = false;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { host, port = 22, username, privateKey, password } = this.options;

      const config: Config = {
        host,
        port,
        username,
        privateKey: privateKey ? require('fs').readFileSync(privateKey) : undefined,
        password
      };

      this.client.on('ready', () => {
        console.log(`Connected to ${host}:${port} as ${username}`);
        this.isConnected = true;
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });

      this.client.connect(config);
    });
  }

  public async executeCommand(command: string): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Not connected to remote host');
    }

    return new Promise((resolve, reject) => {
      this.client.exec(command, (err, stream) => {
        if (err) {
          reject(err);
        }

        let stdout = '';
        let stderr = '';

        stream.on('close', (code) => {
          if (code === 0) {
            resolve(stdout);
          } else {
            reject(new Error(`Command exited with code ${code}\n${stderr}`));
          }
        });

        stream.on('data', (data) => {
          stdout += data;
        });

        stream.stderr.on('data', (data) => {
          stderr += data;
        });
      });
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.on('end', () => {
        console.log('Disconnected from remote host');
        this.isConnected = false;
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });

      this.client.end();
    });
  }
}

export default RemoteHost;
