// контроллеры карточек
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundErros');
const RequestError = require('../errors/RequestError');

// получение всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next); // .catch(err => next(err));
};

// создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch(next);
};

// удаление карточки
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с таким id не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id карточки'));
      }
      return next(err);
    });
};

// добавление лайка карточке
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((updateCard) => res.status(200).send(updateCard))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с таким id не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id карточки'));
      }
      return next(err);
    });
};

// удаление лайка карточке
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((updateCard) => res.status(200).send(updateCard))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с таким id не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
