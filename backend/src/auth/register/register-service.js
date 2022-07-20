import mongoose from 'mongoose';
import { isEmail } from 'validator';

import User from '../../api/users/user-model';
import HttpError from '../../utils/HttpError';

const registerService = {
  async createUser(userData) {
    if (!isEmail(userData.email)) throw new HttpError('Invalid e-mail address.', 400);

    const foundUser = await User.findOne({ email: userData.email });
    if (foundUser) throw new HttpError('This e-mail is already taken. Try another one.', 400);

    try {
      const newUser = new User(userData);
      const { _doc: { __v, password, ...restUserData } } = await newUser.save();
      return restUserData;
    } catch (error) {
      if (!(error instanceof mongoose.Error)) throw error;
      
      const invalidField = Object.values(error.errors)[0];
      if (invalidField.kind === 'required') {
        throw new HttpError('All fields are required.', 400);
      } else if (invalidField.kind === 'maxlength') {
        throw new HttpError(`${invalidField.path} can't be longer than ${invalidField.properties.maxlength} characters.`, 400);
      } else {
        throw new HttpError(`${invalidField.properties.message}`, 400);
      }
    }
  },
};

export default registerService;
