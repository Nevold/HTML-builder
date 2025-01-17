const { readdir, stat } = require('fs/promises');
const path = require('path');
const { stderr } = process;

const filePath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await readdir(filePath);
    files.forEach(async (file) => {
      const currentFilePath = path.join(filePath, file);
      try {
        const stats = await stat(currentFilePath);
        if (stats.isFile()) {
          console.log(
            `\x1b[1;31m${
              path.parse(currentFilePath).name
            }\x1b[0m - \x1b[1;32m${path
              .parse(currentFilePath)
              .ext.slice(1)}\x1b[0m - \x1b[1;34m${stats.size / 1000}kb\x1b[0m`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    stderr.write(`Error: ${err.message}`);
  }
})();
