const readline = require('readline');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.writeFile(filePath, '', err => { // создать пустой файл
  if (err) throw err;
});

function recursiveReadLine() {
  rl.question('Hi dear friend. What do you think of backend? ', (answer) => {
    if (answer === 'exit') {
      console.log('Goodbye, dear friend');
      return rl.close();
    }

    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.size) { // проверка не пустой ли фаил
        fs.appendFile(filePath, `\n${answer}`, err => { // добавить данные в фаил с новой строки
          if (err) throw err;
        });
        recursiveReadLine();
      } else {
        fs.appendFile(filePath, answer, err => { // добавить данные в фаил в первой строке
          if (err) throw err;
        });
        recursiveReadLine();
      }
    });
  });
}
recursiveReadLine();

process.stdin.on('keypress', (char, key) => {
  if (key && key.ctrl && key.name === 'c') {
    console.log('Goodbye, dear friend');
  }
});

// ГЛОБАЛЬНЫЙ ОБЪЕКТ process - сюда вводяться переменные из консоли при запуске файла node 02-write-file