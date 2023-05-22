// контроллеры пользователя
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundErros');
const RequestError = require('../errors/RequestError');

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      next(err);
    });
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
