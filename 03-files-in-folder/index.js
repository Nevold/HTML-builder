const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const { stderr } = process;

const filePath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await readdir(filePath);
    files.forEach((file) => {
      const currentFilePath = path.join(filePath, file);
      fs.stat(currentFilePath, (error, stats) => {
        if (error) {
          console.log(error);
        } else if (stats.isFile()) {
          console.log(
            `\x1b[1;31m${path.parse(currentFilePath).name}\x1b[0m - \x1b[1;32m${path
              .parse(currentFilePath)
              .ext.slice(1)}\x1b[0m - \x1b[1;34m${stats.size / 1000}kb\x1b[0m`
          );
        }
      });
    });
  } catch (err) {
    stderr.write(`Error: ${err.message}`);
  }
})();
