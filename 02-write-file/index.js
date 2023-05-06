const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write('Please, enter text:\n');

const handleError = () => {
  console.log('Oops! Something went wrong!');
};

const handleEnd = (massage) => {
  console.log(`You entered the exit command:\x1b[33m ${massage}\x1b[0m Bye!`);
  process.exit();
};

stdin.on('data', function (chunk) {
  if (chunk.toString().trim() == 'exit') {
    handleEnd('Exit');
  }
});

stdin.on('error', handleError).pipe(writeStream);

process.on('SIGINT', () => handleEnd('Ctrl+C'));
