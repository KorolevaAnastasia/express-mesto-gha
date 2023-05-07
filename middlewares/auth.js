const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (next) => {
  next(new AuthError('Необходима авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'secret-key');
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;
  return next();
};
