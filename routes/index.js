const express = require('express');
const { NOT_FOUND } = require('../utils/constants');

const routes = express.Router();

routes.all('*', express.json());

routes.use((req, res, next) => {
  req.user = { _id: '6449220103b34c9ec4b13319' };
  next();
});

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.all('*', (req, res) => res.status(NOT_FOUND).send({ message: 'Страница не найдена' }));

module.exports = { routes };
