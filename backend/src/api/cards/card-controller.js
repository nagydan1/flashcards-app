import cardService from './card-service';

const cardController = {
  async get(req, res, next) {
    try {
      const cards = await cardService.getCards(req.user._id);
      res.status(200).json({ cards });
    } catch (error) {
      next(error);
    }
  },
  async post(req, res, next) {
    try {
      const isSaved = await cardService.createCard(req);
      const message = isSaved ? 'Saved successfully' : 'Save failed';
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  },
  async patch(req, res, next) {
    try {
      const isUpdated = await cardService.updateCard(req);
      const message = isUpdated ? 'Updated successfully' : 'Update failed';
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const isDeleted = await cardService.deleteCard(req);
      const message = isDeleted ? 'Deleted successfully' : 'Deletion failed';
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  },
};

export default cardController;
