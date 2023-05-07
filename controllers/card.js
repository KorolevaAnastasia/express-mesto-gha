const Card = require('../models/card');
const { CREATED } = require('../utils/constants');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      else next(err);
    });
};

module.exports.removeCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) next(new NotFoundError('Карточка с указанным _id не найдена.'));
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные при удалении карточки.'));
      else next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user } }, { new: true })
    .then((card) => {
      if (!card) next(new NotFoundError('Передан несуществующий _id карточки.'));
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные при лайке карточки.'));
      else next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user } }, { new: true })
    .then((card) => {
      if (!card) next(new NotFoundError('Передан несуществующий _id карточки.'));
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные при дизлайке карточки.'));
      else next(err);
    });
};
