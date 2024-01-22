const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const pathToAssets = path.resolve(__dirname, 'assets');
const pathToComponents = path.resolve(__dirname, 'components');
const pathToStyles = path.resolve(__dirname, 'styles');
const pathToDist = path.resolve(__dirname, 'project-dist');
const pathToTemplate = path.resolve(__dirname, 'template.html');

function copyDir(from, to) {
  const base = path.basename(from);
  const pathToCopyAssets = path.resolve(to, base);

  fsPromises
    .mkdir(to, { recursive: true })
    .then(() =>
      fsPromises.rm(pathToCopyAssets, { recursive: true, force: true }),
    )
    .then(() => fsPromises.readdir(from, { withFileTypes: true }))
    .then((dirs) => {
      dirs.forEach((dir) => {
        if (dir.isDirectory()) {
          const pathToDir = path.resolve(from, dir.name);
          const pathToCopyDir = path.resolve(pathToCopyAssets, dir.name);

          fsPromises.mkdir(pathToCopyDir, { recursive: true }).then(() => {
            fsPromises.readdir(pathToDir).then((files) => {
              files.forEach((file) => {
                const pathToFile = path.resolve(pathToDir, file);
                const pathToCopyFile = path.resolve(pathToCopyDir, file);

                fsPromises.copyFile(pathToFile, pathToCopyFile);
              });
            });
          });
        }
      });
    });
}

function mergeStyles(from, to, bundleName = 'style') {
  const pathToBundle = path.resolve(to, `${bundleName}.css`);

  fsPromises.mkdir(to, { recursive: true }).then(() => {
    const outputStream = fs.createWriteStream(pathToBundle);

    fsPromises.readdir(from, { withFileTypes: true }).then((files) => {
      files.forEach((file) => {
        if (file.isFile() && file.name.includes('css')) {
          const pathToFile = path.resolve(from, file.name);

          const inputStream = fs.createReadStream(pathToFile);
          inputStream.pipe(outputStream);
        }
      });
    });
  });
}

function createTemplate(templatePath, componentsPath, to) {
  const pathToBuild = path.resolve(to, 'index.html');

  let builtTemplate;
  fsPromises.mkdir(to, { recursive: true }).then(() => {
    builtTemplate = fsPromises
      .readFile(templatePath, 'utf-8')
      .then((template) => {
        fsPromises
          .readdir(componentsPath, { withFileTypes: true })
          .then((components) => {
            components.forEach((component) => {
              if (component.isFile() && component.name.endsWith('html')) {
                const pathToComponent = path.resolve(
                  componentsPath,
                  component.name,
                );
                const componentName = path.parse(pathToComponent).name;

                fsPromises
                  .readFile(pathToComponent, 'utf-8')
                  .then((componentContent) => {
                    template = template.replace(
                      `{{${componentName}}}`,
                      componentContent,
                    );

                    fs.writeFile(pathToBuild, template, (err) => {
                      if (err) throw new Error(err.message);
                    });
                  });
              }
            });
          });
      });
  });
}

fsPromises
  .mkdir(pathToDist, { recursive: true })
  .then(() => createTemplate(pathToTemplate, pathToComponents, pathToDist))
  .then(() => mergeStyles(pathToStyles, pathToDist))
  .then(() => copyDir(pathToAssets, pathToDist));
