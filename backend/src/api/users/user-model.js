import mongoose from 'mongoose';
import { isEmail, isStrongPassword } from 'validator';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isEmail,
      message: 'Invalid e-mail address',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (password) => isStrongPassword(password, { minSymbols: 0 }),
      message: 'Password must be at least 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.',
    },
  },
});

export default mongoose.model('user', UserSchema);
