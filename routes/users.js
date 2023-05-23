const router = require('express').Router();

// импортируем контроллеры
const {
  getUsers,
  getUserById,
  // createUser,
  editProfile,
  editAvatar,
  // login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', editProfile);
router.patch('/me/avatar', editAvatar);
// router.post('/u', login);

module.exports = router;
