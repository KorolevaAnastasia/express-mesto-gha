const jsonwebtoken = require('jsonwebtoken');
const { AuthError } = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    next(new AuthError('Необходима авторизация'));
    return;
  }
  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV ? JWT_SECRET : 'secret-key');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
