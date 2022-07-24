import express from 'express';
import cors from 'cors';

import authorization from '../middlewares/authorization';
import users from './users/user-routes';
import cards from './cards/card-routes';
import democards from './democards/democard-routes';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.use(democards);

router.use(authorization);
router.use(users);
router.use(cards);

export default router;
