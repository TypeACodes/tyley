import { Command } from '../tyley';
import { version, dependencies, devDependencies } from '../tyley.json';

export class VersionCommand implements Command {
  public readonly name = 'version';
  public readonly description = 'Displays the current version and dependency tree of Tyley Package Manager';

  public execute(): void {
    console.log(`Tyley Package Manager version ${version}`);
    console.log(`Dependencies:`);
    this.printDependencyTree(dependencies);
    console.log(`Dev Dependencies:`);
    this.printDependencyTree(devDependencies);
  }

  private printDependencyTree(dependencyList: any): void {
    Object.entries(dependencyList).forEach(([name, version]) => {
      console.log(`├─ ${name}@${version}`);
      if (typeof version === 'object') {
        this.printDependencyTree(version);
      }
    });
  }
}
