import express from 'express';
import cors from 'cors';

import users from './users/user-routes';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.use(authorization);
router.use(users);

export default router;
