import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { traceMiddleware } from './middlewares/trace.middleware';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import servicesRoutes from './routes/services.routes';
import templatesRoutes from './routes/templates.routes';
import quotesRoutes from './routes/quotes.routes';
import consultationsRoutes from './routes/consultations.routes';
import blogsRoutes from './routes/blogs.routes';
import adminRoutes from './routes/admin.routes';
import portfoliosRoutes from './routes/portfolios.routes';
import prisma from './config/db';
import logger from './utils/logger';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // In production, customize this to your front-end URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { statusCode: 429, message: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Parse JSON body
app.use(express.json());

// Request Tracing
app.use(traceMiddleware);

// Health Check Endpoints (complying with SRS #598)
app.get('/health', async (_req, res) => {
  try {
    // Basic Prisma DB check
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'UP',
      database: 'HEALTHY',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error({ message: 'Health Check Database Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({
      status: 'DOWN',
      database: 'UNHEALTHY',
      error: error instanceof Error ? error.message : 'Database error',
      timestamp: new Date().toISOString()
    });
  }
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/templates', templatesRoutes);
app.use('/api/v1/quotes', quotesRoutes);
app.use('/api/v1/quote', quotesRoutes);
app.use('/api/v1/consultations', consultationsRoutes);
app.use('/api/v1/consultation', consultationsRoutes);
app.use('/api/v1/blogs', blogsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/portfolios', portfoliosRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
