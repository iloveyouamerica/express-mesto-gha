// миддлвэр auth
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  // дастаём авторизационный заголовок
  const { authorization } = req.headers;

  // проверим что заголовок есть или начинается с Bearer
  if (!authorization || !authorization.startWidth('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  // достаём токен и метожем replace отсекаем приставку Bearer
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // верифицируем токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
