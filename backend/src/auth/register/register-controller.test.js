import registerService from './register-service';
import registerController from './register-controller';

jest.mock('./register-service');

const req = {
  firstName: 'Tom',
  lastName: 'Test',
  email: 'tom.test@tmail.com',
  password: 'Password123',
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockNext = jest.fn();

describe('Register controller\'s post method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with error thrown by service', async () => {
    const error = new Error('Something went wrong.');
    registerService.createUser.mockRejectedValueOnce(error);
    await registerController.post(req, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(error);
    expect(mockRes.json).not.toBeCalled();
  });

  it('should return user data after saving it in the database.', async () => {
    const data = 'fakeData';
    registerService.createUser.mockResolvedValueOnce(data);
    await registerController.post(req, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toBeCalledWith({ user: data });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});
