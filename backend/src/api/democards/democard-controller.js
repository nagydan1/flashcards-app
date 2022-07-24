import demoCardService from './democard-service';

const demoCardController = {
  async get(req, res, next) {
    try {
      const cards = await demoCardService.getDemoCards();
      res.status(200).json({ cards });
    } catch (error) {
      next(error);
    }
  },
};

export default demoCardController;
