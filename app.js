const express = require('express'); // импорт express
const mongoose = require('mongoose'); // импорт моста для связи с mongodb
const { errors } = require('celebrate'); // спец. миддлвэр celebrate для обработки ошибок
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginJoi, createUserJoi } = require('./middlewares/celebrate');
const { PORT, DB_URI } = require('./config');
const centralCatchErrors = require('./middlewares/centralCatchErrors');

const app = express();

// чтобы хакеры не видели лишнюю информацию о сервере (по книге Eaton R Brown)
app.disable('x-powered-by');

// подключаемся к серверу mongo и к базе данных
mongoose.connect(DB_URI)
  .then(() => {
    console.log('Соединение с базой данных `mestobd` установлено!');
  })
  .catch((err) => {
    console.log(`Ошибка соединения с базой данных: ${err.name}`);
  });

app.use(express.json()); // Для парсинга тела запроса в формате JSON

app.post('/signin', loginJoi, login);
app.post('/signup', createUserJoi, createUser);

// защищаем роуты авторизацией
app.use(auth);

// подключение всех роутов
app.use(routes);

// обработчик ошибок celebrate
app.use(errors());

// централизованная обработка ошибок
app.use(centralCatchErrors);

// запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT} - ура!`);
});
