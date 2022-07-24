import loginService from './login-service';
import loginController from './login-controller';

jest.mock('./login-service');

const mockReq = {
  body: {
    email: 'tom.test@tmail.com',
    password: 'Password123',
  },
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockNext = jest.fn();

describe('Login controller\'s post method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with error thrown by service', async () => {
    const error = new Error('Something went wrong.');
    loginService.getToken.mockRejectedValueOnce(error);
    await loginController.post(mockReq, mockRes, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(error);
    expect(mockRes.json).not.toBeCalled();
  });

  it('should return token if user data are correct.', async () => {
    const token = 'fakeToken';
    loginService.getToken.mockResolvedValueOnce(token);
    await loginController.post(mockReq, mockRes, mockNext);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({ token });
    expect(mockRes.json).toBeCalledTimes(1);
  });
});
