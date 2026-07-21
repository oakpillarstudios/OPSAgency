import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger';

export interface TracedRequest extends Request {
  requestId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const traceMiddleware = (req: TracedRequest, res: Response, next: NextFunction) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  const startTime = Date.now();

  logger.info({
    message: `Incoming Request: ${req.method} ${req.originalUrl}`,
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      message: `Request Completed: ${req.method} ${req.originalUrl} - Status ${res.statusCode} (${duration}ms)`,
      requestId,
      statusCode: res.statusCode,
      durationMs: duration
    });
  });

  next();
};
