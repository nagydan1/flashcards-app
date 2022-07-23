import userService from './user-service';

const userController = {
  async get(req, res, next) {
    try {
      const data = await userService.getUserById(req.user._id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  async patch(req, res, next) {
    try {
      const data = await userService.patchUserData(req);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
