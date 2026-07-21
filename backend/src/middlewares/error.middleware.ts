import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message: `API Error: ${message}`,
    error: err,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(statusCode).json({
    statusCode,
    message: statusCode === 500 ? 'An internal server error occurred' : message,
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId || undefined
  });
};
