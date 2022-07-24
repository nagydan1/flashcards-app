import express from 'express';
import demoCardController from './democard-controller';

const router = express.Router();

router.get('/democards', demoCardController.get);

export default router;
