import DemoCard from './democard-model';
import demoCardService from './democard-service';

jest.mock('./democard-model');

const mockCardsList = {
  cards: [
    {
      _id: '62aba6a7ebf2fbe18e3023ba',
      nativeText: 'and',
      foreignText: 'y',
    },
    {
      _id: '62aba6b2ebf2fbe18e3023bc',
      nativeText: 'or',
      foreignText: 'o',
    },
  ],
};

describe('Democard service\'s getDemoCards method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cards from database', async () => {
    DemoCard.find.mockReturnValue(mockCardsList);
    const data = await demoCardService.getDemoCards();
    expect(data).toEqual(mockCardsList);
  });
});
