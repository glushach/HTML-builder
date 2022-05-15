const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}); // создал папку
fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));

async function readComponents() { // в этой функции код идет по мере выполения await
  // получение файлов из директории component
  const componentsArr = await fsPromises.readdir(path.join(__dirname, './components'));
  console.log(componentsArr);

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
      if (template.indexOf(tag)) {
        let templateArrChars = template.split('');
        let tagStart = template.indexOf(tag);
        let tagSpace = tag.length;
        templateArrChars.splice(tagStart, tagSpace, objFragments[key]);
        template = templateArrChars.join('');
      }
    } // end for

    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, err => {
      if (err) throw err;
    });

  });
});

// node 06-build-page