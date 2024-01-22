const path = require('path');
const fs = require('fs/promises');

const textPath = path.join(__dirname, 'text.txt');

async function readFile(path) {
  const filehandle = await fs.open(path);
  const stream = filehandle.createReadStream({ encoding: 'utf-8' });

  stream.pipe(process.stdout);
}
readFile(textPath);
