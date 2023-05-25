const router = require('express').Router();

// импортируем контроллеры
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// импортируем миддлвэр проверки celebrate
const { createCardJoi, checkCardIdJoi } = require('../middlewares/celebrate');

// все запросы на /cards/..
router.get('/', getCards);
router.post('/', createCardJoi, createCard);
router.delete('/:cardId', checkCardIdJoi, deleteCard);
router.put('/:cardId/likes', checkCardIdJoi, likeCard);
router.delete('/:cardId/likes', checkCardIdJoi, dislikeCard);

module.exports = router;
