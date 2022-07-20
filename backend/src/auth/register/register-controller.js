import registerService from './register-service';

const registerController = {
  async post(req, res, next) {
    try {
      const user = await registerService.createUser(req.body);
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  },
};

export default registerController;
