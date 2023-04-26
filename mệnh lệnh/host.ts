import RemoteHost from './src/remote_host';

async function runRemoteCommand(host: string, command: string, username: string, privateKey?: string, password?: string): Promise<void> {
  const remoteHost = new RemoteHost({
    host,
    username,
    privateKey,
    password
  });

  try {
    await remoteHost.connect();
    const output = await remoteHost.executeCommand
