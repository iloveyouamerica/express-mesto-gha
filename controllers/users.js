// контроллеры пользователя
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundErros');
const RequestError = require('../errors/RequestError');
const ConflictError = require('../errors/ConflictError');
const AuthError = require('../errors/AuthError');

// получение всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// получение конкретного пользователя по _id
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с таким id не найден'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id пользователя'));
      }
      return next(err);
    });
};

// добавление нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new RequestError('Некорректные данные при создании пользователя'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// редактирование профиля пользователя
const editProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updateUser) => res.send(updateUser))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        if (err.name === 'DocumentNotFoundError') {
          return next(new NotFoundError('Пользователь с таким id не найден'));
        }
        if (err.name === 'CastError') {
          return next(new RequestError('Переданы некорректные данные'));
        }
      }
      return next(err);
    });
};

// редактирование аватара пользователя
const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        if (err.name === 'DocumentNotFoundError') {
          return next(new NotFoundError('Пользователь с таким id не найден'));
        }
        if (err.name === 'CastError') {
          return next(new RequestError('Переданы некорректные данные'));
        }
      }
      return next(err);
    });
};

// контроллер login
const login = (req, res, next) => {
  const { email, password } = req.body;

  // поиск пользователя по email
  User.findOne({ email }).select('+password') // здесь хэш пароля нужен, поэтому select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неверный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Неверный email или пароль'));
          }
          // создаём токен
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          // вернём токен клиенту
          return res.send(token);
        });
    })
    .catch(next);
};

// получаем информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
  login,
  getUserInfo,
};
