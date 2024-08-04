/* eslint-disable no-console */
import fsExtra from 'fs-extra';
import { join } from 'path';
import { correctSourceMapsPaths } from './correct-source-maps.js';
import { createPackageFile } from './format-package-json.js';

const args = process.argv.slice(2);
const packagePath = process.cwd();
const esmDirectoryPath = join(packagePath, './dist/_esm');
const distDirectoryPath = join(packagePath, './dist');

createPackageFile(packagePath, distDirectoryPath).then(() => console.log(`Created package.json`));

const copyFiles = async () => {
  const files = ['README.md'];
  for (const file of files) {
    await fsExtra.copy(join(packagePath, file), join(distDirectoryPath, file)).catch((err) => {
      console.error(`Error copying ${file}: ${err}`);
    });
  }
};

Promise.all([correctSourceMapsPaths(esmDirectoryPath)]).then(() => console.log('Source maps correction complete.'));
Promise.all([copyFiles()]).then(() => console.log('Files copied.'));
