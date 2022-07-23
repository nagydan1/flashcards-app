import mongoose from 'mongoose';
import User from './user-model';
import HttpError from '../../utils/HttpError';

const userService = {

  async getUserById(_id) {
    return User.findById(_id).select('firstName lastName');
  },

  async patchUser(req) {
    const { email, password, ...newData } = req.body;

    if (Object.keys(newData).length === 0 || newData === undefined) {
      throw new HttpError('Missing request body.', 400);
    }

    if (newData.oldPassword !== undefined && newData.oldPassword !== '') {
      if (newData.newPassword === undefined || newData.newPassword === '') {
        throw new HttpError('New password is required.', 400);
      }
    }

    if (newData.newPassword !== undefined && newData.newPassword !== '') {
      if (newData.oldPassword === undefined || newData.oldPassword === '') {
        throw new HttpError('Old password is required.', 400);
      }
    }

    const currentData = await User.findById(req.user._id, { email: 0, __v: 0 });

    let isOldPwdCorrect;
    if (newData.oldPassword !== undefined && newData.oldPassword !== ''
      && newData.oldPassword !== undefined && newData.oldPassword !== '') {
      try {
        isOldPwdCorrect = await currentData.comparePassword(newData.oldPassword);
      } catch (error) {
        throw new HttpError('Server error.', 500);
      }
      if (!isOldPwdCorrect) throw new HttpError('Old password is incorrect.', 401);
    }

    Object.keys(newData).forEach((key) => {
      if (currentData[key] !== newData[key]) {
        currentData[key] = newData[key];
      }
    });
    if (isOldPwdCorrect) currentData.password = newData.newPassword;
    try {
      // eslint-disable-next-line no-shadow
      const { _doc: { password, ...updatedData } } = await currentData.save();
      return updatedData;
    } catch (error) {
      if (!(error instanceof mongoose.Error)) throw error;

      const invalidField = Object.values(error.errors)[0];
      if (invalidField.kind === 'required') {
        throw new HttpError('Name fields are required.', 400);
      } else if (invalidField.kind === 'maxlength') {
        throw new HttpError(`${invalidField.path} can't be longer than ${invalidField.properties.maxlength} characters.`, 400);
      } else {
        throw new HttpError(`${invalidField.properties.message}`, 400);
      }
    }
  },
};

export default userService;
