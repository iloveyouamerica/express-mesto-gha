// валидируем запросы к серверу перед запуском контроллеров
const { celebrate, Joi } = require('celebrate');

const { urlRegex } = require('../utils/regex');

// валидация запросов /user

const loginJoi = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

const createUserJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex), // паттерн regex url
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

const getUserByIdJoi = celebrate({
  // валидируем параметры запроса (id пользователя приходит в параметрах url)
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const editProfileJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const editAvatarJoi = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegex), // паттерн regex url
  }),
});

// валидация запросов /cards

const createCardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex), // паттерн regex url
  }),
});

const checkCardIdJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  loginJoi,
  createUserJoi,
  getUserByIdJoi,
  editProfileJoi,
  editAvatarJoi,
  createCardJoi,
  checkCardIdJoi,
};
