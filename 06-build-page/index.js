const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

async function readComponents() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}); // создал папку
  await fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));

  // получение файлов из директории component
  const componentsArr = await fsPromises.readdir(path.join(__dirname, './components'));

  let allPromises = [];
  for(let i = 0; i < componentsArr.length; i++) {
    const pathfile = path.join(__dirname, './components', componentsArr[i]);
    const stream = new fs.ReadStream(pathfile, 'utf8');

    const html = await new Promise((res, req) => {
      stream.on('readable', () => {
        let data = stream.read();
        if (data !== null) {
          const components = {};
          components[componentsArr[i].slice(0, -5)] = data;
          res(components);
        }
      });
    });
    allPromises.push(html);
  }
  return await Promise.all(allPromises);
}
readComponents().then(components => {
  const objFragments = {};
  components.forEach(item => {
    for (let key in item) {
      objFragments[key] = item[key];
    }
  });

  fs.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8', (err, template) => {
    if (err) throw err;
    for (let key in objFragments) {
      let tag = `{{${key}}}`;


      if (template.includes(tag)) {
        let templateArrStrings = template.split('\n');
        let space = 0;
        for (let i = 0; i < templateArrStrings.length; i++) { // получить отступы template
          if (templateArrStrings[i].includes(tag)) {
            let arr = templateArrStrings[i].split(' ');
            let tab = arr.length - 1;
            space = ' '.repeat(tab);
            break;
          }
        }


        let objFragmentsArr = (objFragments[key]).split('\n'); // добавить отступы template в components
        let fragmentModify = '';
        objFragmentsArr.forEach((item, idx, arr) => {
          if (idx > 0) {
            arr[idx] = space + item;
            fragmentModify += `${arr[idx]}\n`;
          } else {
            fragmentModify += `${arr[idx]}\n`;
          }
        });
        objFragments[key] = fragmentModify.slice(0, -1);



        let templateArrChars = template.split('');
        templateArrChars.splice(template.indexOf(tag), tag.length, objFragments[key]);
        template = templateArrChars.join('');
      }
    } // end for

    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, err => {
      if (err) throw err;
    });

  });
});

// Merge styles
fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, data) => {
  if (err) throw err;
  const styles = data.map((file) => {
    if (file.isFile()) {
      return file.name;
    }
  });

  const result = [];
  styles.forEach(file => {
    fs.readFile(path.join(__dirname, 'styles', file), 'utf-8', (err, data) => {
      if (err) throw err;
      result.push(data);



      fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), result.join(''), err => {
        if (err) throw err;
      });
    });
  });
});

// Copy assets
async function copyAssets() {
  const assetsDirPath = path.join(__dirname, 'assets');
  const assetsDirs = await fsPromises.readdir(assetsDirPath, {withFileTypes: true});

  await fs.stat(path.join(__dirname, 'project-dist', 'assets'), (async err => {
    if (!err) { // clear directory 'project-dist/assets'
      fs.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, async (err1) => {
        if (err1) throw err1;
        await assetsDirs.forEach(async dir => {
          await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', dir.name), {recursive: true}); // создал папку assets

          const innerassetsDirs = await fsPromises.readdir(path.join(__dirname, 'assets', dir.name), {withFileTypes: true});

          innerassetsDirs.forEach(file => {
            const src = path.join(__dirname, 'assets', dir.name, file.name);
            const dist = path.join(__dirname, 'project-dist', 'assets', dir.name, file.name);
            fsPromises.copyFile(src, dist, 2);
          });
        });
      });
    } else {
      await assetsDirs.forEach(async dir => {
        await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', dir.name), {recursive: true}); // создал папку assets

        const innerassetsDirs = await fsPromises.readdir(path.join(__dirname, 'assets', dir.name), {withFileTypes: true});

        innerassetsDirs.forEach(file => {
          const src = path.join(__dirname, 'assets', dir.name, file.name);
          const dist = path.join(__dirname, 'project-dist', 'assets', dir.name, file.name);
          fsPromises.copyFile(src, dist, 2);
        });
      });
    }
  }));

}
copyAssets();
// node 06-build-page

// project-dist