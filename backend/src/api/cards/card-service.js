import mongoose from 'mongoose';
import Card from './card-model';
import HttpError from '../../utils/HttpError';

const { ObjectId } = mongoose.Types;

const cardService = {

  async getCards(userId) {
    return Card.find({ userId }).select('nativeText foreignText');
  },

  async createCard(req) {
    const { nativeText, foreignText } = req.body;

    if (Object.keys(req.body).length === 0 || (nativeText === '' && foreignText === '')) {
      throw new HttpError('All fields are required.', 400);
    }
    if (nativeText === undefined || nativeText === '') {
      throw new HttpError('Native text is required.', 400);
    }
    if (foreignText === undefined || foreignText === '') {
      throw new HttpError('Foreign text is required.', 400);
    }
    try {
      const newCard = new Card(req.body);
      newCard.userId = req.user._id;
      const dbRes = await newCard.save();
      return (dbRes.nativeText === req.body.nativeText);
    } catch (error) {
      error.message = 'Server error.';
      error.status = 500;
      throw error;
    }
  },

  async updateCard(req) {
    const { nativeText, foreignText } = req.body;

    if (Object.keys(req.body).length === 0 || (nativeText === '' && foreignText === '')) {
      throw new HttpError('All fields are required.', 400);
    }
    if (nativeText === undefined || nativeText === '') {
      throw new HttpError('Native text is required.', 400);
    }
    if (foreignText === undefined || foreignText === '') {
      throw new HttpError('Foreign text is required.', 400);
    }
    if (!ObjectId.isValid(req.params.cardId)) {
      throw new HttpError('Card ID is not valid.', 404);
    }
    try {
      const card = await Card.findOne({ _id: req.params.cardId });
      if (req.user._id !== card.userId.toString()) throw new HttpError('Permission denied.', 403);
      card.nativeText = nativeText;
      card.foreignText = foreignText;
      const dbRes = await card.save();
      return (dbRes.nativeText === nativeText && dbRes.foreignText === foreignText);
    } catch (error) {
      if (error.status !== 403) {
        error.message = 'Server error.';
        error.status = 500;
      }
      throw error;
    }
  },

  async deleteCard(req) {
    if (!ObjectId.isValid(req.params.cardId)) throw new HttpError('Card ID is not valid.', 404);

    try {
      const card = await Card.findOne({ _id: req.params.cardId });
      if (req.user._id !== card.userId.toString()) throw new HttpError('Permission denied.', 403);
      const dbRes = await Card.deleteOne({ _id: req.params.cardId });
      return dbRes.acknowledged;
    } catch (error) {
      if (error.status !== 403) {
        error.message = 'Server error.';
        error.status = 500;
      }
      throw error;
    }
  },
};

export default cardService;
