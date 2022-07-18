import express from 'express';
import cors from 'cors';

import register from './register/register-routes';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.use(register);

export default router;
