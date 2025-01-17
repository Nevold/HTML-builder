const path = require('path');
const { stderr } = process;
const {
  mkdir,
  readdir,
  copyFile,
  unlink,
  access,
  stat,
} = require('fs/promises');

const filePath = path.join(__dirname, 'files');
const filePathCopy = path.join(__dirname, 'files-copy');

async function makeDirectory() {
  mkdir(filePathCopy, { recursive: true });
}

async function removeDirectoryFile() {
  await access(filePathCopy);
  const files = await readdir(filePathCopy);
  const promisesFiles = files.map(async (file) => {
    const currentFilePathCopy = path.join(filePathCopy, file);
    await unlink(currentFilePathCopy);
  });
  await Promise.all(promisesFiles);
}

async function copyDirectoryFile() {
  await access(filePathCopy);
  const files = await readdir(filePath);
  const promisesFiles = files.map(async (file) => {
    const currentFilePath = path.join(filePath, file);
    const currentFilePathCopy = path.join(filePathCopy, file);
    const fileStatus = await stat(currentFilePath);
    if (fileStatus.isFile()) {
      await copyFile(currentFilePath, currentFilePathCopy);
    }
  });
  await Promise.all(promisesFiles);
}
(async () => {
  try {
    await makeDirectory();
    await removeDirectoryFile();
    await copyDirectoryFile();
  } catch (err) {
    stderr.write(`Error: ${err.message}`);
  }
})();
