import mongoose from 'mongoose';
import logger from './logger';
import app from './app';
import config from './config';

const PORT = config.port || 8080;
const URI = config.db.uri || 'mongodb://localhost:27017/flashcards';

mongoose.connect(URI, (err) => {
  if (err) logger.error(err.message);
  logger.info('Successfully connected to MongoDB');
});

app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}`);
});
