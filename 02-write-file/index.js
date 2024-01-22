const path = require('path');
const fs = require('fs');
const readline = require('readline');

const outputPath = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(outputPath);

const rl = readline.createInterface(process.stdin, process.stdout);

const exit = () => {
  rl.write('Bye bye!');
  rl.close();
};

rl.write('Type something...\n');

rl.on('line', (input) => {
  if (input.toString().startsWith('exit')) exit();
  else outputStream.write(input);
});

rl.on('SIGINT', exit);
