import mongoose from 'mongoose';
import User from '../../api/users/user-model';
import registerService from './register-service';
import HttpError from '../../utils/HttpError';

jest.mock('../../api/users/user-model');

const mockUserData = {
  firstName: 'Tom',
  lastName: 'Test',
  email: 'tom.test@tmail.com',
  password: 'Password123',
};

const mockSavedUser = {
  _doc: {
    ...mockUserData,
    _id: '62d6e17b704d303ebc10084e',
  },
};

const mockDbError = new mongoose.Error();

describe('Register service\'s createUser method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if e-mail format is invalid', async () => {
    expect.assertions(3);
    try {
      await registerService.createUser({ ...mockUserData, email: 'invalid@e-mail' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Invalid e-mail address.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if e-mail is already taken', async () => {
    User.findOne.mockResolvedValueOnce(true);
    expect.assertions(3);
    try {
      await registerService.createUser(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('This e-mail is already taken. Try another one.');
      expect(error.status).toBe(400);
    }
  });

  it('should return user data without password if user is created', async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.prototype.save.mockResolvedValueOnce(mockSavedUser);
    const user = await registerService.createUser(mockUserData);
    expect(user).toEqual({
      firstName: 'Tom',
      lastName: 'Test',
      email: 'tom.test@tmail.com',
      _id: '62d6e17b704d303ebc10084e',
    });
  });

  it('should throw the error if error type isn\'t mongoose', async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.prototype.save.mockRejectedValueOnce(new Error('Something went wrong.'));
    expect.assertions(2);
    try {
      await registerService.createUser(mockUserData);
    } catch (error) {
      expect(error).not.toBeInstanceOf(HttpError);
      expect(error.message).toBe('Something went wrong.');
    }
  });

  it('should throw an error if a field is missing', async () => {
    User.findOne.mockResolvedValueOnce(null);
    mockDbError.errors = {
      password: {
        path: 'password',
        kind: 'required',
      },
    };
    User.prototype.save.mockRejectedValueOnce(mockDbError);
    expect.assertions(3);
    try {
      await registerService.createUser(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('All fields are required.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error if a field is too long', async () => {
    User.findOne.mockResolvedValueOnce(null);
    mockDbError.errors = {
      password: {
        path: 'firstName',
        kind: 'maxlength',
        properties: {
          maxlength: 20,
        },
      },
    };
    User.prototype.save.mockRejectedValueOnce(mockDbError);
    expect.assertions(3);
    try {
      await registerService.createUser(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('firstName can\'t be longer than 20 characters.');
      expect(error.status).toBe(400);
    }
  });

  it('should else throw an error with user defined message', async () => {
    User.findOne.mockResolvedValueOnce(null);
    mockDbError.errors = {
      password: {
        path: 'password',
        kind: 'user defined',
        properties: {
          message: 'Password must be at least 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.',
        },
      },
    };
    User.prototype.save.mockRejectedValueOnce(mockDbError);
    expect.assertions(3);
    try {
      await registerService.createUser(mockUserData);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('Password must be at least 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.');
      expect(error.status).toBe(400);
    }
  });
});
