import DemoCard from './democard-model';

const demoCardService = {
  async getDemoCards() {
    return DemoCard.find({});
  },
};

export default demoCardService;
