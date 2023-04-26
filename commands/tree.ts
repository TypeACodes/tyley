import * as fs from 'fs';
import * as treeify from 'treeify';

interface Package {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readJsonFile(filename: string): Package | null {
  try {
    const file = fs.readFileSync(filename, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    console.error(`[X] Error reading file ${filename}:`, error);
    return null;
  }
}

function getPackageTree(pkg: Package | null, parent: Record<string, unknown>): Record<string, unknown> {
  const tree: Record<string, unknown> = {};
  const dependencies = pkg?.dependencies || {};
  const devDependencies = pkg?.devDependencies || {};

  Object.assign(tree, parent);

  for (const name in dependencies) {
    const version = dependencies[name];
    const subTree = { [name]: version };
    tree[name] = getPackageTree(readJsonFile(`./node_modules/${name}/package.json`), subTree);
  }

  for (const name in devDependencies) {
    const version = devDependencies[name];
    const subTree = { [name]: version };
    tree[name] = getPackageTree(readJsonFile(`./node_modules/${name}/package.json`), subTree);
  }

  return tree;
}

function printPackageTree(pkg: Package | null) {
  const tree = getPackageTree(pkg, {});
  console.log(treeify.asTree(tree, true));
}

const pkg = readJsonFile('./tyley.json');
printPackageTree(pkg);
