const path = require('path');
const fs = require('fs/promises');

const filesPath = path.join(__dirname, 'files');

async function copyDir(originPath) {
  const { name } = path.parse(originPath);
  const filesCopyPath = path.join(__dirname, `${name}-copy`);

  try {
    await fs.mkdir(filesCopyPath);

    const files = await fs.readdir(originPath);

    for (const file of files) {
      const originFilePath = path.join(originPath, file);
      const copyFilePath = path.join(filesCopyPath, file);

      fs.copyFile(originFilePath, copyFilePath);
    }
  } catch {
    await fs.rm(filesCopyPath, { recursive: true, force: true });
    copyDir(originPath);
  }
}
copyDir(filesPath);
