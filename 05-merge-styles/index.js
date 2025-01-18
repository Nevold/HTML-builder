const fs = require('fs');
const { readdir, stat } = require('fs/promises');
const path = require('path');
const { stderr } = process;

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const filePath = path.join(__dirname, 'styles');

async function mergeStyles() {
  const writeStream = fs.createWriteStream(bundlePath);
  const files = await readdir(filePath);
  const promisesFiles = files.map(async (file) => {
    const currentFilePath = path.join(filePath, file);
    const fileStatus = await stat(currentFilePath);
    if (
      fileStatus.isFile() &&
      path.parse(currentFilePath).ext.slice(1) === 'css'
    ) {
      const readStream = fs.createReadStream(currentFilePath, 'utf-8');
      readStream.pipe(writeStream);
    }
  });
  await Promise.all(promisesFiles);
}

(async () => {
  try {
    await mergeStyles();
  } catch (err) {
    stderr.write(`Error: ${err.message}`);
  }
})();
