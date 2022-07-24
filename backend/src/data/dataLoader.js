import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';
import DemoCard from '../api/democards/democard-model';
import democards from './democards';

const { db } = config;

async function connectToDb() {
  try {
    await mongoose.connect(db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('MongoDB Connected');
  } catch (err) {
    logger.error(err.message);
  }
}
async function loadData() {
  await connectToDb();
  await DemoCard.insertMany(democards);
  logger.info('Collections initialized');
  process.exit(0);
}

loadData();
