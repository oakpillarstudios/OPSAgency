import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TracedRequest } from './trace.middleware';
import prisma from '../config/db';
import logger from '../utils/logger';

export const requireAuth = async (req: TracedRequest, res: Response, next: NextFunction) => {
  try {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ statusCode: 401, message: 'Authentication required. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'oakpillar_secret') as {
      userId: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ statusCode: 401, message: 'User session invalid. Please log in again.' });
    }

    if (user.disabled) {
      return res.status(403).json({ statusCode: 403, message: 'Your account has been suspended by an administrator.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return next();
  } catch (error) {
    logger.warn({ message: 'Authentication failed', error: error instanceof Error ? error.message : error });
    return res.status(401).json({ statusCode: 401, message: 'Session expired or invalid token.' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: TracedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ statusCode: 401, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn({
        message: 'Access Denied: Insufficient Role permissions',
        userId: req.user.id,
        userRole: req.user.role,
        allowedRoles,
        path: req.originalUrl
      });
      return res.status(403).json({ statusCode: 403, message: 'Access denied. Insufficient privileges.' });
    }

    return next();
  };
};
