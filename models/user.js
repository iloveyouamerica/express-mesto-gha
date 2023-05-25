// модель пользователя
const mongoose = require('mongoose');
const validator = require('validator');
const { urlRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => urlRegex.test(avatar),
      message: 'Неверный формат ссылки',
    },
  },
  email: {
    type: String,
    require: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный e-mail',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // не возвращаем хэш пароля
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
