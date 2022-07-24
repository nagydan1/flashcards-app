import User from './user-model';
import HttpError from '../../utils/HttpError';
import userService from './user-service';

jest.mock('./user-model');
const mockSave = jest.fn();
const mockSelect = jest.fn();
const mockComparePassword = jest.fn();

const mockFoundUser = {
  _id: '6257326ca4457e2db2e75614',
  password: '$2b$10$xtpwQgmZfwuNxgACsUg8rOaNS3sXtggcFbeUlo9y4nUffsAYS8gDi',
  firstName: 'Timmy',
  lastName: 'Tester',
  email: 'tom.tes.@tmail.com',
  save: mockSave,
  select: mockSelect,
  comparePassword: mockComparePassword,
};

const mockSelectedUser = {
  _id: '6257326ca4457e2db2e75614',
  firstName: 'Timmy',
  lastName: 'Tester',
};

const mockSavedUser = {
  _doc: {
    _id: '6257326ca4457e2db2e75614',
    firstName: 'Tom',
    lastName: 'Test',
  },
};

const mockRequestBody = {
  firstName: 'Tom',
  lastName: 'Test',
};

describe('User service\'s getUserById method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return user data saved in database', async () => {
    const _id = '6257326ca4457e2db2e75614';
    User.findById.mockReturnValue(mockFoundUser);
    mockSelect.mockResolvedValueOnce(mockSelectedUser);
    const data = await userService.getUserById(_id);
    expect(data).toEqual(mockSelectedUser);
  });
});

describe('User service\'s patchUser method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw an error if request body is missing', async () => {
    expect.assertions(3);
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: {} };
    try {
      await userService.patchUser(req);
    } catch (error) {
      expect(error.message).toBe('Missing request body.');
      expect(error.status).toBe(400);
      expect(error).toBeInstanceOf(HttpError);
    }
  });

  test('should throw an error if body only has new password', async () => {
    expect.assertions(3);
    const req = { user: { id: '6257326ca4457e2db2e75614' }, body: { newPassword: 'xyz', ...mockRequestBody } };
    try {
      await userService.patchUser(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('Old password is required.');
    }
  });

  test('should throw an error if body only has old password', async () => {
    expect.assertions(3);
    const req = { user: { id: '6257326ca4457e2db2e75614' }, body: { oldPassword: 'xyz', ...mockRequestBody } };
    try {
      await userService.patchUser(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(400);
      expect(err.message).toBe('New password is required.');
    }
  });

  test('should throw an error if comparePassword returns with error', async () => {
    expect.assertions(3);
    const req = { user: { id: '6257326ca4457e2db2e75614' }, body: { oldPassword: 'xyz', newPassword: 'xyz', ...mockRequestBody } };
    User.findById.mockReturnValue(mockFoundUser);
    mockComparePassword.mockRejectedValueOnce(new Error('Any error.'));
    try {
      await userService.patchUser(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(500);
      expect(err.message).toBe('Server error.');
    }
  });

  test('should throw an error if old password is incorrect', async () => {
    expect.assertions(3);
    const req = { user: { id: '6257326ca4457e2db2e75614' }, body: { oldPassword: 'xyz', newPassword: 'xyz', ...mockRequestBody } };
    User.findById.mockReturnValue(mockFoundUser);
    mockComparePassword.mockResolvedValueOnce(false);
    try {
      await userService.patchUser(req);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect(err.status).toBe(401);
      expect(err.message).toBe('Old password is incorrect.');
    }
  });

  test('should return updated user data if password fields are left empty', async () => {
    const req = { user: { _id: '6257326ca4457e2db2e75614' }, body: mockRequestBody };
    User.findById.mockResolvedValueOnce(mockFoundUser);
    mockSave.mockResolvedValueOnce(mockSavedUser);
    const data = await userService.patchUser(req);
    expect(data).toEqual(mockSavedUser._doc);
  });

  test('should return updated user data if old password is correct', async () => {
    const req = { user: { id: '6257326ca4457e2db2e75614' }, body: { oldPassword: 'xyz', newPassword: 'xyz', ...mockRequestBody } };
    User.findById.mockReturnValue(mockFoundUser);
    mockComparePassword.mockResolvedValueOnce(true);
    mockSave.mockResolvedValueOnce(mockSavedUser);
    const data = await userService.patchUser(req);
    expect(data).toEqual(mockSavedUser._doc);
  });
});
