const router = require('express').Router();

// импортируем контроллеры
const {
  getUsers,
  getUserById,
  // createUser,
  editProfile,
  editAvatar,
  // login,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo); // получаем информацию о текущем пользователе
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', editProfile);
router.patch('/me/avatar', editAvatar);
// router.post('/u', login);

module.exports = router;
