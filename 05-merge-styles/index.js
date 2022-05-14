const fs = require('fs/promises');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err) => {
  if (err) throw err;
}).then(files => {
  const styles = files.filter((file) => {
    if (file.isFile()) {
      return file.name.indexOf('.css') !== -1;
    }
  });

  const result = [];
  styles.forEach(file => {
    fs.readFile(path.join(__dirname, 'styles', file.name), 'utf-8', (err) => {
      if (err) throw err;
    }).then(data => {
      result.push(data);
      fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), result, err => {
        if (err) throw err;
      });
    });
  });

});

// node 05-merge-styles