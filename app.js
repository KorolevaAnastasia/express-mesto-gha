const express = require('express');
const mongoose = require('mongoose').default;

require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;
const cookieParser = require('cookie-parser');
const { routes } = require('./routes');
const auth = require('./middlewares/auth');

app.all('*', express.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((error) => console.error('Ошибка подключения:', error));

app.use('/', require('./routes/auth'));

app.use(auth);

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
