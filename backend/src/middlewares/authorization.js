import jwt from 'jsonwebtoken';
import config from '../config';
import HttpError from '../utils/HttpError';

export default (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new HttpError('Missing token.', 401);
    next(error);
  } else {
    const tokenBody = token.slice(7);
    jwt.verify(tokenBody, config.jwtSecret, (err, decoded) => {
      if (err) {
        const error = err;
        error.status = 401;
        error.message = 'Invalid token.';
        next(error);
      } else {
        req.user = { ...decoded };
        next();
      }
    });
  }
};
