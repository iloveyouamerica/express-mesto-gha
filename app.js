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

app.use((req, res, next) => {
  req.user = {
    _id: '645bd1459f057fb7932d6597', // вставили сюда _id созданного пользователя (временно)
  };

  next();
});

app.use('/', routes);

// запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT} - ура!`);
});
