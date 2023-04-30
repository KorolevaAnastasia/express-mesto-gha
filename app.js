const express = require('express');
const mongoose = require('mongoose').default;

const app = express();
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((error) => console.error('Ошибка подключения:', error));

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
