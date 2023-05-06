const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath);

let data = '';

const handleError = () => {
  console.log('Oops!Something went wrong.');
  readableStream.destroy();
};

readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log(data));
readableStream.on('error', handleError);
