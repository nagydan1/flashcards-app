import userService from './user-service';
import userController from './user-controller';

jest.mock('./user-service');

const req = { user: { id: '6257326ca4457e2db2e75614' } };

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockNext = jest.fn();

describe('User controller\'s get method', () => {
  it('should call next with error thrown by service', async () => {
    const err = new Error('something went wrong');
    userService.getUserById.mockRejectedValueOnce(err);
    await userController.get(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return user data saved in the database', async () => {
    const data = 'fakeData';
    userService.getUserById.mockResolvedValueOnce(data);
    await userController.get(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith(data);
    expect(mockRes.json).toBeCalledTimes(1);
  });
});

describe('User controller\'s patch method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with error thrown by service', async () => {
    const err = new Error('something went wrong again');
    userService.patchUser.mockRejectedValueOnce(err);
    await userController.patch(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(err);
  });

  it('should return the updated user data saved in the database', async () => {
    const data = 'fakeDataFromDb';
    userService.patchUser.mockResolvedValueOnce(data);
    await userController.patch(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith(data);
    expect(mockRes.json).toBeCalledTimes(1);
  });
});
