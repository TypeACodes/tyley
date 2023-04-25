import { Command } from 'tyley';
import axios from 'axios';

export class SearchCommand implements Command {
  public readonly name = 'search';
  public readonly description = 'Searches for packages on the npm registry';
  public readonly usage = 'tyley search <query>';

  public async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Please provide a search query');
      return;
    }

    const query = args.join('+');

    try {
      const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${query}&size=10`);

      const packages = response.data.objects.map((result: any) => {
        return {
          name: result.package.name,
          description: result.package.description,
          version: result.package.version,
          author: result.package.author?.name ?? 'unknown',
          url: result.package.links.npm,
        };
      });

      console.log(`[?] Search results for "${query}":\n`);

      packages.forEach((pkg) => {
        console.log(`Name: ${pkg.name}`);
        console.log(`├── Description: ${pkg.description}`);
        console.log(`├── Version: ${pkg.version`);
        console.log(`│   └── Author: ${pkg.author}`);
        console.log(`└── URL Of Repo(npm): ${pkg.url}`);
        console.log();
        console.log(`Use tyley install ${pkg.name} or npm install ${pkg.name} to install the package`);
      });
    } catch (err) {
      console.log('An error occurred while searching for packages:' + "\n└──", err.message);
    nerr}
}
