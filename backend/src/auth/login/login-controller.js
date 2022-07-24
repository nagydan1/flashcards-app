import loginService from './login-service';

const loginController = {
  async post(req, res, next) {
    try {
      const token = await loginService.getToken(req.body);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  },
};

export default loginController;
