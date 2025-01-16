const { createReadStream } = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = createReadStream(filePath);

let data = '';

const handleError = () => {
  console.log('Oops!Something went wrong.');
  readableStream.destroy();
};

const getData = (chunk) => (data += chunk.toString());

readableStream
  .on('data', getData)
  .on('error', handleError)
  .on('end', () => console.log(data));
