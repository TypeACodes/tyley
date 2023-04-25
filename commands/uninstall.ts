import { Command } from '../tyley';
import fs from 'fs';
import path from 'path';
import { TyleyConfig, Package } from './types';

export class UninstallCommand implements Command {
  public readonly name = 'uninstall';
  public readonly description = 'Uninstalls a package from the project';
  public readonly usage = 'tyley uninstall <package>';

  public execute(args: string[]): void {
    if (args.length === 0) {
      console.log('[...] Please provide the name of the package to uninstall');
      return;
    }

    const packageName = args[0];

    const tyleyConfigPath = path.resolve(process.cwd(), 'tyley.json');

    if (!fs.existsSync(tyleyConfigPath)) {
      console.log('tyley.json file not found');
      return;
    }

    const tyleyConfig: TyleyConfig = JSON.parse(fs.readFileSync(tyleyConfigPath, 'utf8'));

    const packageIndex = tyleyConfig.packages.findIndex((pkg) => pkg.name === packageName);

    if (packageIndex < 0) {
      console.log(`[⛁ >> ♻] Package "${packageName}" is not installed`);
      return;
    }

    tyleyConfig.packages.splice(packageIndex, 1);

    fs.writeFileSync(tyleyConfigPath, JSON.stringify(tyleyConfig, null, 2));

    console.log(`[✔] Package "${packageName}" uninstalled successfully`);
  }
}
