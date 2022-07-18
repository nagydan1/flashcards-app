import User from './user-model';

const userService = {

  async createUser(userData) {
    const newUser = new User(userData);
    return newUser.save();
  },
};

export default userService;
