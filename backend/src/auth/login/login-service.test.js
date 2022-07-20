import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import User from '../../api/users/user-model';
import loginService from './login-service';
import HttpError from '../../utils/HttpError';

jest.mock('../../api/users/user-model');

const mockUserFromBd = {
  firstName: 'Tom',
  lastName: 'Test',
  email: 'tom.test@tmail.com',
  password: '$2a$10$vD3bIpA2MBzoyLG02.Jdk.RgWoMzvkVmK2KXTWE9pgEGPUlvFIzpC',
  _id: ObjectId(),
  __v: 0,
  comparePassword: jest.fn(),
};

const mockDbError = new mongoose.Error();

describe('Login service\'s getToken method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user data is missing', async () => {
    expect.assertions(3);
    const mockUserData = {};
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('All fields are required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if e-mail and password fields are empty', async () => {
    expect.assertions(3);
    const mockUserData = { email: '', password: '' };
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('All fields are required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if e-mail is not provided', async () => {
    expect.assertions(3);
    const mockUserData = { password: 'Password123' };
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('E-mail is required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if e-mail field is empty', async () => {
    expect.assertions(3);
    const mockUserData = { email: '', password: 'Password123' };
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('E-mail is required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if password is not provided', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'tom.test@tmail.com' };
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Password is required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if password field is empty', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'tom.test@tmail.com', password: '' };
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Password is required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if e-mail address is not valid', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'tom.test@tmail', password: 'Password123' };
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Invalid e-mail address.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw server error if database responds with error', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'tom.test@tmail.com', password: 'Password123' };
    User.findOne.mockRejectedValueOnce(mockDbError);
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Server error.');
      expect(error.status).toBe(500);
    }
  });

  it('should throw server error if comparePassword runs to error', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'tom.test@tmail.com', password: 'Password123' };
    User.findOne.mockResolvedValueOnce(mockUserFromBd);
    mockUserFromBd.comparePassword.mockRejectedValueOnce(mockDbError);
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Server error.');
      expect(error.status).toBe(500);
    }
  });

  it('should throw an error if e-mail is not found in database', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'rom.test@incorrect-mail.com', password: 'Password123' };
    User.findOne.mockResolvedValueOnce(null);
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('E-mail or password is incorrect.');
      expect(error.status).toBe(401);
    }
  });

  it('should throw an error if password is incorrect', async () => {
    expect.assertions(3);
    const mockUserData = { email: 'tom.test@tmail.com', password: 'password12WRONG' };
    User.findOne.mockResolvedValueOnce(mockUserFromBd);
    mockUserFromBd.comparePassword.mockResolvedValueOnce(false);
    try {
      await loginService.getToken(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('E-mail or password is incorrect.');
      expect(error.status).toBe(401);
    }
  });

  it('should return a jwt token that includes all required keys', async () => {
    const mockUserData = { email: 'tom.test@tmail.com', password: 'Password123' };
    User.findOne.mockResolvedValue(mockUserFromBd);
    mockUserFromBd.comparePassword.mockResolvedValueOnce(true);
    jwt.sign = jest.fn();
    await loginService.getToken(mockUserData);
    expect(jwt.sign.mock.calls[0][0]).toEqual({
      id: mockUserFromBd._id.toString(),
      firstName: mockUserFromBd.firstName,
      roles: ['user'],
    });
  });
});
