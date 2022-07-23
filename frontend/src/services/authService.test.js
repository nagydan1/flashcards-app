import jwtDecode from 'jwt-decode';
import AuthService from './authService';

const mockUser = {
  _id: '62d86531c448aa42d325cc43',
  firstName: 'TOm',
  role: ['user'],
};
jest.mock('jwt-decode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('AuthService\'s', () => {
  it('login method should return token and user data, if input fields are correct', async () => {
    jwtDecode.mockReturnValue(mockUser);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        token,
      }),
    });
    global.fetch = mockFetch;
    const mockSetItem = jest.fn();
    localStorage.setItem = mockSetItem;
    const response = await AuthService.login({ email: 'tom.test@tmail.com', password: '1212qwQW' });
    expect(jwtDecode).toHaveBeenCalledTimes(1);
    expect(jwtDecode).toHaveBeenLastCalledWith(token);
    expect(response).toEqual({ token, user: mockUser });
  });

  it('getUser method should return user and token, if token exists', () => {
    jwtDecode.mockReturnValue(mockUser);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const mockGetItem = jest.fn(() => token);
    Storage.prototype.getItem = mockGetItem;
    const response = AuthService.getUser();
    expect(response).toEqual({ token, user: mockUser });
  });

  it('getUser method should return null, if token doesn\'t exist', () => {
    const token = null;
    const mockGetItem = jest.fn(() => token);
    Storage.prototype.getItem = mockGetItem;
    const response = AuthService.getUser();
    expect(response).toEqual({ token: null, user: null });
  });

  it('logout method should delete token from localStorage', () => {
    const mockRemoveItem = jest.fn();
    Storage.prototype.removeItem = mockRemoveItem;
    AuthService.logout();
    expect(mockRemoveItem).toHaveBeenCalledWith('access_token');
    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
  });
});
