const express = require('express');

const routes = express.Router();
const { errors } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const { handleError } = require('../errors/handleError');

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

routes.use(errors);
routes.use(handleError);

module.exports = { routes };
