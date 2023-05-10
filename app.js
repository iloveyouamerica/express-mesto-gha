const express = require('express'); // импорт express
const mongoose = require('mongoose'); // импорт моста для связи с mongo
const User = require('./models/user'); // импорт модели user

const app = express();

// настроим порт 3000
const { PORT = 3000 } = process.env;

// чтобы хакеры не видели лишнюю информацию о сервере (по книге Eaton R Brown)
app.disable('x-powered-by');

// подключаемся к серверу mongo и к база данных
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Соединение с базой данных `mestobd` установлено!');
  })
  .catch((err) => {
    console.log(`Ошибка соединения с базой данных: ${err}`);
  });

// использовать парсер тела экспресса, вместо body-parser
app.use(express.json());

// подключаем роуты, мидлвары и всё остальное
/* app.post('/', (req, res) => {
  const { name, about } = req.body;
  console.log(`name: ${name}, about: ${about}`);
  User.create({ name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
}); */

app.patch('/:id', (req, res) => {
  console.log('PATCH');
  User.findByIdAndUpdate(req.params.id, { name: 'Фокс Малдер' })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
});

app.get('/', (req, res) => {
  console.log('get');
  res.send('домашний путь /');
});

app.get('/:id', (req, res) => {
  console.log('get динамический запрос с параметрами');
  console.log(`req.params: ${req.params.id}`);
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT} - ура!`);
});
