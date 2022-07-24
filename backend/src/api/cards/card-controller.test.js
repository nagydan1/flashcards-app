import cardService from './card-service';
import cardController from './card-controller';

jest.mock('./card-service');

const req = { user: { _id: '6257326ca4457e2db2e75614' } };

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockNext = jest.fn();

describe('Card controller\'s get method', () => {
  it('should call next with error thrown by service', async () => {
    const err = new Error('Something went wrong');
    cardService.getCards.mockRejectedValueOnce(err);
    await cardController.get(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return cards list saved in the database', async () => {
    const data = 'fakeData';
    cardService.getCards.mockResolvedValueOnce(data);
    await cardController.get(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ cards: data });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});

describe('Card controller\'s post method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with error thrown by service', async () => {
    const err = new Error('Something went wrong again');
    cardService.createCard.mockRejectedValueOnce(err);
    await cardController.post(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return success message', async () => {
    cardService.createCard.mockResolvedValueOnce(true);
    await cardController.post(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ message: 'Saved successfully' });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});

describe('Card controller\'s patch method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with error thrown by service', async () => {
    const err = new Error('Something went wrong still');
    cardService.updateCard.mockRejectedValueOnce(err);
    await cardController.patch(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return success message', async () => {
    cardService.updateCard.mockResolvedValueOnce(true);
    await cardController.patch(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ message: 'Updated successfully' });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});

describe('Card controller\'s delete method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with error thrown by service', async () => {
    const err = new Error('Something always goest wrong');
    cardService.deleteCard.mockRejectedValueOnce(err);
    await cardController.delete(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return success message', async () => {
    cardService.deleteCard.mockResolvedValueOnce(true);
    await cardController.delete(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ message: 'Deleted successfully' });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});
