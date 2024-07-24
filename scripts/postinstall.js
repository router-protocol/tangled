/* eslint-disable no-console */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageName = '@solana-mobile/wallet-adapter-mobile';
const packageJsonPath = join('packages', 'solana-react', 'node_modules', packageName, 'package.json');

try {
  // Read the package.json file
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  // Check if the types field needs to be updated
  if (packageJson.exports && packageJson.exports['.'] && packageJson.exports['.'].types !== './lib/types/index.d.ts') {
    console.log(`Fixing types field in ${packageName}/package.json`);

    // Update the types field
    packageJson.exports['.'].types = './lib/types/index.d.ts';

    // Write the updated package.json back to the file
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(`Successfully updated ${packageName}/package.json`);
  } else {
    console.log(`No update needed for ${packageName}/package.json`);
  }
} catch (error) {
  console.error(`Error updating ${packageName}/package.json:`, error);
}
