import { Command, Tyley } from '../tyley';
import axios from 'axios';
import cliProgress from 'cli-progress';
import fs from 'fs';

interface Package {
  name: string;
  version: string;
}

interface TyleyConfig {
  packages: Package[];
}

export class InstallCommand implements Command {
  public readonly name = 'install';
  public readonly description = 'Installs a package and its dependencies';
  public readonly usage = 'tyley install <package>';

  private readonly npmRegistryUrl = 'https://registry.npmjs.org';

  constructor(private tyley: Tyley) {}

  public async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.error('[X] Package name is required');
      return;
    }

    const packageName = args[0];
    const packageVersion = await this.getLatestVersion(packageName);

    if (!packageVersion) {
      console.error(`[?] Package "${packageName}" not found`);
      return;
    }

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(100, 0);

    try {
      const packageData = await this.downloadPackage(packageName, packageVersion, progressBar);
      await this.installPackage(packageData, progressBar);
    } catch (error) {
      console.error(`[X] Failed to install package "${packageName}": ${error.message}`);
    } finally {
      progressBar.stop();
    }
  }

  private async getLatestVersion(packageName: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.npmRegistryUrl}/${packageName}`);
      const { latest } = response.data['dist-tags'];

      return latest;
    } catch (error) {
      return null;
    }
  }

  private async downloadPackage(
    packageName: string,
    packageVersion: string,
    progressBar: cliProgress.SingleBar,
  ): Promise<Record<string, unknown>> {
    const response = await axios.get(`${this.npmRegistryUrl}/${packageName}/${packageVersion}`);
    const packageData = response.data;

    const totalSize = Buffer.byteLength(JSON.stringify(packageData));
    let downloadedSize = 0;

    const downloadStream = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);

    return new Promise((resolve, reject) => {
      downloadStream.start(totalSize, 0);

      const chunks: any[] = [];

      response.data
        .on('data', (chunk) => {
          chunks.push(chunk);
          downloadedSize += chunk.length;
          const progress = (downloadedSize / totalSize) * 100;
          progressBar.update(progress);
          downloadStream.update(downloadedSize);
        })
        .on('end', () => {
          downloadStream.stop();
          const packageJson = JSON.parse(Buffer.concat(chunks).toString());
          resolve(packageJson);
        })
        .on('error', (error) => {
          downloadStream.stop();
          reject(error);
        });
    });
  }

  private async installPackage(packageData: Record<string, unknown>, progressBar: cliProgress.SingleBar): Promise<void> {
    const packageInfo: Package = {
      name: packageData.name as string,
      version: packageData.version as string,
    };

    const tyleyConfigPath = './tyley.json';
    let tyleyConfig: TyleyConfig = { packages: [] };

    if (fs.existsSync(tyleyConfigPath)) {
           tyleyConfig = JSON.parse(fs.readFileSync(tyleyConfigPath, 'utf8')) as TyleyConfig;
    }

    const packageIndex = tyleyConfig.packages.findIndex(
      (pkg) => pkg.name === packageInfo.name && pkg.version === packageInfo.version,
    );

    if (packageIndex >= 0) {
      console.log(`[?] Package "${packageInfo.name}@${packageInfo.version}" is already installed`);
      return;
    }

    const dependencies = packageData.dependencies || {};

    for (const [depName, depVersion] of Object.entries(dependencies)) {
      const depPackageInfo: Package = {
        name: depName,
        version: depVersion as string,
      };

      if (!tyleyConfig.packages.some((pkg) => pkg.name === depPackageInfo.name && pkg.version === depPackageInfo.version)) {
        await this.installPackage(depPackageInfo, progressBar);
      }
    }

    tyleyConfig.packages.push(packageInfo);

    fs.writeFileSync(tyleyConfigPath, JSON.stringify(tyleyConfig, null, 2));

    console.log(`[⛁] Package "${packageInfo.name}@${packageInfo.version}" installed successfully`);
  }
}
