import { Command } from '../tyley';
import * as npm from 'npm-programmatic';
import ProgressBar = require('progress');

export class PublishCommand implements Command {
  public readonly name = 'publish';
  public readonly description = 'Publishes the package to the npm registry';
  public readonly usage = 'tyley publish';

  public execute(args: string[]): void {
    console.log('[⛌] Publishing package to npm registry...');

    // Set up progress bar
    const bar = new ProgressBar('[:bar] :percent :etas', {
      total: 100,
      width: 50,
      complete: '=',
      incomplete: ' '
    });

    // Publish the package to the npm registry
    npm.publish('.', {
      progress: (info) => {
        if (info.total) {
          bar.update(info.percent);
        }
      }
    }).then(() => {
      console.log('[🔗] Package published successfully!');
    }).catch((error) => {
      console.log(`[!] Error publishing package: ${error.message}`);
    });
  }
}
