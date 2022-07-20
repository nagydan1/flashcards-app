import jwt from 'jsonwebtoken';
import { isEmail } from 'validator';
import config from '../../config';

import User from '../../api/users/user-model';
import HttpError from '../../utils/HttpError';

const loginService = {

  createToken(user) {
    const payload = {
      id: user._id.toString(),
      firstName: user.firstName,
      roles: ['user'],
    };
    return jwt.sign(payload, config.jwtSecret);
  },

  async getToken(loginData) {
    const { email, password } = loginData;

    if (Object.keys(loginData).length === 0 || (email === '' && password === '')) {
      throw new HttpError('All fields are required.', 400);
    }
    if (email === undefined || email === '') {
      throw new HttpError('E-mail is required.', 400);
    }
    if (password === undefined || password === '') {
      throw new HttpError('Password is required.', 400);
    }
    if (!isEmail(email)) {
      throw new HttpError('Invalid e-mail address.', 400);
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch (error) {
      throw new HttpError('Server error.', 500);
    }

    let isPasswordCorrect;
    try {
      isPasswordCorrect = await user?.comparePassword(password);
    } catch (error) {
      throw new HttpError('Server error.', 500);
    }

    if (isPasswordCorrect) return this.createToken(user);

    throw new HttpError('E-mail or password is incorrect.', 401);
  },
};

export default loginService;
