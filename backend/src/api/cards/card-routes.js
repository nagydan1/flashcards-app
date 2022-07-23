import express from 'express';
import cardController from './card-controller';

const router = express.Router();

router.get('/cards', cardController.get);
router.post('/cards', cardController.post);
router.patch('/cards/:cardId', cardController.patch);
router.delete('/cards/:cardId', cardController.delete);

export default router;
