const express = require('express');
const { errors } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { handleError } = require('../errors/handleError');

const routes = express.Router();

routes.all('*', express.json());

routes.use('/', require('./auth'));

routes.use(auth);

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

routes.use(errors());
routes.use(handleError);

module.exports = { routes };
