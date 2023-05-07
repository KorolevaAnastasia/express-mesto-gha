const Card = require('../models/card');
const { CREATED } = require('../utils/constants');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch(next);
};

module.exports.removeCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      const userId = req.user._id.toString();
      const cardUserId = card.owner._id.toString();

      if (userId !== cardUserId) return next(new ForbiddenError('Нельзя удалить чужую карточку.'));

      return removeCard();
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return next(new NotFoundError('Передан несуществующий _id карточки.'));
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) return next(new NotFoundError('Передан несуществующий _id карточки.'));
      return res.send(card);
    })
    .catch(next);
};
