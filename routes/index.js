const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  NOT_FOUND_ERROR,
} = require('../utils/response-codes');

router.use('/users', userRouter); // роут на users
router.use('/cards', cardRouter); // роут на cards
router.use('/*', (req, res) => { // любой другой роут отличающийся от users или cards
  res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий запрос' });
});

module.exports = router;
