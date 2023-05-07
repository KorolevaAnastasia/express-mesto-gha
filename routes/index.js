const express = require('express');

const routes = express.Router();
const NotFoundError = require('../errors/NotFoundError');

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = { routes };
