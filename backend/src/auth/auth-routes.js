import express from 'express';
import cors from 'cors';

import register from './register/register-routes';
import login from './login/login-routes';

const router = express.Router();

router.use(cors());
router.use(express.json());

router.use(register);
router.use(login);

export default router;
