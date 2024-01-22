const path = require('path');
const fs = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

async function filesInFolder(folderPath) {
  const files = await fs.readdir(folderPath, { withFileTypes: true });

  for (const file of files) {
    if (!file.isFile()) continue;

    const filePath = path.join(file.path, file.name);

    const [name, ext] = file.name.split('.');
    const { size } = await fs.stat(filePath);

    process.stdout.write(`${name} - ${ext} - ${size} bytes\n`);
  }
}
filesInFolder(folderPath);
