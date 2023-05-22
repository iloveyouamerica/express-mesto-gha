const express = require('express'); // импорт express
const mongoose = require('mongoose'); // импорт моста для связи с mongodb
const routes = require('./routes/index');

const app = express();

// настроим порт 3000
const { PORT = 3000 } = process.env;

// чтобы хакеры не видели лишнюю информацию о сервере (по книге Eaton R Brown)
app.disable('x-powered-by');

// подключаемся к серверу mongo и к базе данных
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Соединение с базой данных `mestobd` установлено!');
  })
  .catch((err) => {
    console.log(`Ошибка соединения с базой данных: ${err}`);
  });

// использовать парсер тела экспресса, вместо body-parser
app.use(express.json());

app.use(routes);

// централизованная обработка ошибок
// обработчик принимает на себя все ошибки, которые были переданы с помощью next(err)
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  // console.log(`Status: ${statusCode}, Err: ${message}`);

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT} - ура!`);
});
