import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`OakPillar Studios Backend Server listening on port ${PORT}`);
});
