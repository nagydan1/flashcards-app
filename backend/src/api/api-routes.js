import express from 'express';
import cors from 'cors';

import users from './users/user-routes';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.use(users);

export default router;
