const Card = require('../models/card');
const {
  NOT_FOUND, BAD_REQUEST, CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user } }, { new: true })
    .then((card) => {
      if (!card) return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user } }, { new: true })
    .then((card) => {
      if (!card) return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      return res.status(500).send({ message: err.message });
    });
};
