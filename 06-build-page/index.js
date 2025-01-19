const path = require('path');
const { stderr } = process;
const {
  mkdir,
  readdir,
  copyFile,
  rm,
  access,
  stat,
  readFile,
} = require('fs/promises');
const fs = require('fs');

const buildDir = path.join(__dirname, 'project-dist');
const bundlePathCss = path.join(__dirname, 'project-dist', 'style.css');
const filePathCss = path.join(__dirname, 'styles');
const filePathAssets = path.join(__dirname, 'assets');
const filePathAssetsCopy = path.join(buildDir, 'assets');
const filePathHtmlComponents = path.join(__dirname, 'components');
const templatePathHtml = path.join(__dirname, 'template.html');
const templatePathHtmlCopy = path.join(buildDir, 'index.html');

async function makeDirectory(nameDir = buildDir) {
  mkdir(nameDir, { recursive: true });
}

async function mergeStylesCss() {
  const writeStream = fs.createWriteStream(bundlePathCss);
  const files = await readdir(filePathCss);
  const promisesFiles = files.map(async (file) => {
    const currentFilePath = path.join(filePathCss, file);
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

async function mergeTemplateHtml() {
  const files = await readdir(filePathHtmlComponents);

  let indexHtml = await readFile(templatePathHtml, 'utf-8');
  files.forEach(async (file) => {
    const templateSourceObj = {};
    const currentFilePath = path.join(filePathHtmlComponents, file);
    const fileStatus = await stat(currentFilePath);
    if (
      fileStatus.isFile() &&
      path.parse(currentFilePath).ext.slice(1) === 'html'
    ) {
      const readStream = fs.createReadStream(currentFilePath, 'utf-8');
      const currHtmlTemp = `{{${path.parse(currentFilePath).name}}}`;
      readStream.on('data', (chunk) => {
        templateSourceObj[currHtmlTemp] = templateSourceObj[currHtmlTemp]
          ? (templateSourceObj[currHtmlTemp] += chunk)
          : chunk;
      });
      readStream.on('end', () => {
        const writeStream = fs.createWriteStream(templatePathHtmlCopy);
        indexHtml = indexHtml
          .split(currHtmlTemp)
          .join(templateSourceObj[currHtmlTemp]);
        writeStream.write(indexHtml);
      });
    }
  });
}

async function copyDirectoryFile(
  copyDir = filePathAssets,
  copyDirBuild = filePathAssetsCopy,
) {
  const files = await readdir(copyDir);
  const promisesFiles = files.map(async (file) => {
    const currentFilePath = path.join(copyDir, file);
    const currentFilePathCopy = path.join(copyDirBuild, file);
    const fileStatus = await stat(currentFilePath);
    if (fileStatus.isFile()) {
      await copyFile(currentFilePath, currentFilePathCopy);
    } else {
      await makeDirectory(currentFilePathCopy);
      await copyDirectoryFile(currentFilePath, currentFilePathCopy);
    }
  });
  await Promise.all(promisesFiles);
}

async function removeAssetsFile() {
  try {
    await access(filePathAssetsCopy);
    await rm(filePathAssetsCopy, { recursive: true, force: true });
    await makeDirectory(filePathAssetsCopy);
  } catch {
    await makeDirectory(filePathAssetsCopy);
  }
}

(async () => {
  try {
    await makeDirectory();
    await mergeStylesCss();
    await mergeTemplateHtml();
    await removeAssetsFile();
    await copyDirectoryFile();
  } catch (err) {
    stderr.write(`Error: ${err.message}`);
  }
})();
