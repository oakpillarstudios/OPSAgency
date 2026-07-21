import { Router } from 'express';
import { getAllPortfolios, getPortfolioBySlug } from '../controllers/portfolios.controller';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const router = Router();

// Middleware to optionally extract user from JWT without blocking if unauthenticated
const optionalAuth = async (req: any, _res: any, next: any) => {
  try {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'oakpillar_secret') as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      if (user && !user.disabled) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }
  } catch (error) {
    // Ignore error, optional authentication
  }
  next();
};

router.get('/', getAllPortfolios);
router.get('/:slug', optionalAuth, getPortfolioBySlug);

export default router;
