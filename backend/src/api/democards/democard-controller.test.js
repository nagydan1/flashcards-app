import demoCardService from './democard-service';
import demoCardController from './democard-controller';

jest.mock('./democard-service');

const req = {};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockNext = jest.fn();

describe('Democard controller\'s get method', () => {
  it('should call next with error thrown by service', async () => {
    const err = new Error('Something went wrong');
    demoCardService.getDemoCards.mockRejectedValueOnce(err);
    await demoCardController.get(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return cards list from the database', async () => {
    const data = 'fakeData';
    demoCardService.getDemoCards.mockResolvedValueOnce(data);
    await demoCardController.get(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ cards: data });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});
