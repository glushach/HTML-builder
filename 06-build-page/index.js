const path = require('path');
const fsPromises = require('fs').promises;
const files = fsPromises.readdir(path.join(__dirname, 'components')); // получение файлов из директории components

fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));


fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err) => {
  if (err) throw err;
}).then(data => {
  files.then(files => {           // files все components
    const arr = data.split('\n'); // читать файл по строчно
    console.log(arr)

    const MAIN = [];
    arr.forEach((line, idx) => {
      for (let i = 0; i < files.length; i++) {
        if (line.includes(files[i].slice(0, -5))) {
          fsPromises.readFile(path.join(__dirname, 'components', files[i]), 'utf-8', err => {
            if (err) throw err;
          }).then(data => {
            console.log('DATA', arr[idx])
            arr.splice(idx, 1, data); // замена делаеться
            console.log(arr);

            //console.log('TRUE', data);
          });

        }
      }



    }); // end forEach

    console.log('ARRAY', arr[17])
  });
});

// node 06-build-page