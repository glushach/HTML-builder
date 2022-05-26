const path = require('path');
const fs = require('fs/promises');
const PATH = path.join(__dirname, 'secret-folder');

fs.readdir(PATH, {withFileTypes: true}, (err) => {
  if (err) throw err;
}).then(files => {
  files.forEach(file => {
    if (file.isFile()) {
      let f = file.name;
      fs.stat(path.join(PATH, f)).then(res => {
        console.log(`${path.parse(f).name} - ${(path.parse(f).ext).slice(1)} - ${res.size} bytes`);
      });
    }
  });
});

// node 03-files-in-folder