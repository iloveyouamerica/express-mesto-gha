// контроллеры пользователя
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundErros');
const RequestError = require('../errors/RequestError');
const ConflictError = require('../errors/ConflictError');

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
};
