const path = require('path');
const fs = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

async function mergeStyles(stylesPath, distPath) {
  const bundlePath = path.join(distPath, 'bundle.css');
  fs.rm(bundlePath, { recursive: true, force: true });

  const files = await fs.readdir(stylesPath, { withFileTypes: true });

  for (const file of files) {
    if (!file.isFile() || !file.name.includes('css')) continue;

    const filePath = path.join(file.path, file.name);
    const fileContent = await fs.readFile(filePath);

    fs.appendFile(bundlePath, fileContent);
  }
}
mergeStyles(stylesPath, distPath);
