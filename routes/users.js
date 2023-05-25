const router = require('express').Router();

// импортируем контроллеры
const {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getUserInfo,
} = require('../controllers/users');

// импортируем миддлвэр проверки celebrate
const { getUserByIdJoi, editProfileJoi, editAvatarJoi } = require('../middlewares/celebrate');

router.get('/', getUsers);
router.get('/me', getUserInfo); // получаем информацию о текущем пользователе
router.get('/:userId', getUserByIdJoi, getUserById);
router.patch('/me', editProfileJoi, editProfile);
router.patch('/me/avatar', editAvatarJoi, editAvatar);

module.exports = router;
