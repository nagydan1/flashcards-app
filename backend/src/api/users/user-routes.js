import express from 'express';
import userController from './user-controller';

const router = express.Router();

router.get('/users', userController.get);
router.patch('/users', userController.patch);

export default router;
