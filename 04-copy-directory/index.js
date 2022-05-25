const path = require('path');
const PATHBefore = path.join(__dirname, 'files');
const PATHAfter = path.join(__dirname, 'files-copy');
const fsPromises = require('fs').promises;

async function copyDir() {
  await fsPromises.mkdir(PATHAfter, {recursive: true}); // создание директории

  await fsPromises.readdir(PATHAfter, (err) => {
    if (err) throw err; // очистка files-copy директории, если в директории files удалили файл
  }).then(files => {
    files.forEach(file => {
      fsPromises.unlink(path.join(PATHAfter, file), (err) => {
        if (err) throw err;
      });
    });
  });

  await fsPromises.readdir(PATHBefore, (err) => {
    if (err) throw err;
  }).then(files => {
    files.forEach(file => {
      fsPromises.copyFile(path.join(PATHBefore, file), path.join(PATHAfter, file));
    });
  });
}
copyDir();

// node 04-copy-directory