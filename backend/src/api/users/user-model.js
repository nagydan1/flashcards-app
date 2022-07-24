import mongoose from 'mongoose';
import { isEmail, isStrongPassword } from 'validator';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    maxLength: 100,
    validate: {
      validator: isEmail,
      message: 'Invalid e-mail address.',
    },
  },
  password: {
    type: String,
    required: true,
    maxLength: 100,
    validate: {
      validator: (password) => isStrongPassword(password, { minSymbols: 0 }),
      message: 'Password must be at least 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.',
    },
  },
});

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  return bcrypt.hash(this.password, 10, (err, salt) => {
    if (err) return next(err);
    this.password = salt;
    return next();
  });
});

// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('user', UserSchema);
