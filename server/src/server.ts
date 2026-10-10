import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT, nodeEnv: env.NODE_ENV, clientOrigin: env.CLIENT_ORIGIN },
    `YSSE Alumni Directory Server started successfully on port ${env.PORT}`
  );
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
