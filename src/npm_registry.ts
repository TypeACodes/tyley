import { Client } from 'npm-registry-client';

interface PackageInfo {
  name: string;
  description?: string;
  version: string;
  author?: string;
  homepage?: string;
  keywords?: string[];
}

function logPackageInfo(pkgInfo: PackageInfo): void {
  console.log(`Name: ${pkgInfo.name}`);
  console.log(`Version: ${pkgInfo.version}`);
  console.log(`Description: ${pkgInfo.description || '(none)'}`);
  console.log(`Author: ${pkgInfo.author || '(none)'}`);
  console.log(`Homepage: ${pkgInfo.homepage || '(none)'}`);
  console.log(`Keywords: ${pkgInfo.keywords?.join(', ') || '(none)'}`);
}

function getPackageInfo(pkgName: string, registryUrl: string): Promise<PackageInfo> {
  return new Promise((resolve, reject) => {
    const client = new Client({ registry: registryUrl });
    client.get(pkgName, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const pkgInfo: PackageInfo = {
          name: data.name,
          description: data.description,
          version: data['dist-tags'].latest,
          author: data.author?.name,
          homepage: data.homepage,
          keywords: data.keywords
        };
        resolve(pkgInfo);
      }
    });
  });
}

async function runNpmRegistry(pkgName: string, registryUrl: string): Promise<void> {
  console.log(`Fetching package information for '${pkgName}' from registry ${registryUrl}...`);
  try {
    const pkgInfo = await getPackageInfo(pkgName, registryUrl);
    logPackageInfo(pkgInfo);
  } catch (err) {
    console.error(`Error fetching package information: ${err.message}`);
    process.exit(1);
  }
}

const pkgName = process.argv[2];
if (!pkgName) {
  console.error('Please specify a package name');
  process.exit(1);
}

const registryUrl = process.env.NPM_REGISTRY || 'https://registry.npmjs.org';
runNpmRegistry(pkgName, registryUrl);
