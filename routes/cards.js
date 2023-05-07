const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/card');
const { regExp } = require('../utils/utils');

const validateParams = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
};

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regExp).required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate(validateParams), removeCard);

router.put('/:cardId/likes', celebrate(validateParams), likeCard);

router.delete('/:cardId/likes', celebrate(validateParams), dislikeCard);

module.exports = router;
