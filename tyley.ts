interface TyleyOptions {
  registry?: string;
  loglevel?: 'silent' | 'error' | 'warn' | 'notice' | 'http' | 'timing' | 'info' | 'verbose';
  json?: boolean;
}

export class Tyley {
  private readonly options: TyleyOptions;

  constructor(options: TyleyOptions = {}) {
    this.options = options;
  }

  public install(packages: string[], options: TyleyOptions = {}): void {
    const combinedOptions = { ...this.options, ...options };
    console.log(`Installing packages: ${packages.join(', ')}`);
    console.log(`Options: ${JSON.stringify(combinedOptions)}`);
  }

  public uninstall(packages: string[], options: TyleyOptions = {}): void {
    const combinedOptions = { ...this.options, ...options };
    console.log(`Uninstalling packages: ${packages.join(', ')}`);
    console.log(`Options: ${JSON.stringify(combinedOptions)}`);
  }

  public update(packages: string[], options: TyleyOptions = {}): void {
    const combinedOptions = { ...this.options, ...options };
    console.log(`Updating packages: ${packages.join(', ')}`);
    console.log(`Options: ${JSON.stringify(combinedOptions)}`);
  }

  public search(query: string, options: TyleyOptions = {}): void {
    const combinedOptions = { ...this.options, ...options };
    console.log(`Searching packages for query: ${query}`);
    console.log(`Options: ${JSON.stringify(combinedOptions)}`);
  }

  public publish(packagePath: string, options: TyleyOptions = {}): void {
    const combinedOptions = { ...this.options, ...options };
    console.log(`Publishing package from path: ${packagePath}`);
    console.log(`Options: ${JSON.stringify(combinedOptions)}`);
  }

  public unpublish(packageName: string, options: TyleyOptions = {}): void {
    const combinedOptions = { ...this.options, ...options };
    console.log(`Unpublishing package: ${packageName}`);
    console.log(`Options: ${JSON.stringify(combinedOptions)}`);
  }

  public static init(packageName: string, options: TyleyOptions = {}): void {
    console.log(`Initializing package ${packageName}`);
    console.log(`Options: ${JSON.stringify(options)}`);
  }

  public static version(): void {
    console.log(`Tyley version 1.0.0`);
  }
}
