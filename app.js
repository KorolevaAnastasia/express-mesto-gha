const express = require('express');
const mongoose = require('mongoose').default;

require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { routes } = require('./routes');
const { handleError } = require('./errors/handleError');

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((error) => console.error('Ошибка подключения:', error));

app.use(routes);

app.use(errors);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
