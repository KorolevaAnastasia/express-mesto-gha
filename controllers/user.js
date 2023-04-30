const User = require('../models/user');
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при получении пользователя.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении данных пользователя.' });
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => res.send({ avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара пользователя.' });
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
