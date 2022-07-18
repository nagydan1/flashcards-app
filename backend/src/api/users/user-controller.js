import userService from './user-service';

const userController = {
  async post(req, res, next) {
    try {
      const data = await userService.createUser(req.body);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
};

export default userController;
