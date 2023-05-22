const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundErros');

router.use('/users', userRouter); // роут на users
router.use('/cards', cardRouter); // роут на cards
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Муршрут не найден'));
});

module.exports = router;
