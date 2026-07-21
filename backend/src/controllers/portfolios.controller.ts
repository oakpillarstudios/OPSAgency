import { Request, Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';

export const getAllPortfolios = async (req: Request, res: Response) => {
  try {
    const { industry, search, featured } = req.query;

    const where: any = {};

    if (featured) {
      where.featured = featured === 'true';
    }

    if (industry) {
      where.industry = String(industry);
    }

    if (search) {
      const searchStr = String(search).toLowerCase();
      where.OR = [
        { projectName: { contains: searchStr } },
        { client: { contains: searchStr } },
        { projectStory: { contains: searchStr } },
        { technologies: { contains: searchStr } }
      ];
    }

    const portfolios = await prisma.portfolio.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ statusCode: 200, portfolios });
  } catch (error) {
    logger.error({ message: 'Get All Portfolios Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve portfolios' });
  }
};

export const getPortfolioBySlug = async (req: TracedRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const portfolio = await prisma.portfolio.findUnique({
      where: { slug }
    });

    if (!portfolio) {
      return res.status(404).json({ statusCode: 404, message: 'Portfolio case study not found.' });
    }

    // Log Activity and increase lead score if user is logged in
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.user.update({
          where: { id: userId },
          data: { leadScore: user.leadScore + 2 } // +2 for viewing a portfolio case study
        });

        await prisma.leadActivity.create({
          data: {
            userId,
            action: 'VIEW_PORTFOLIO',
            details: `Viewed portfolio case study: ${portfolio.projectName}`
          }
        });
      }
    }

    return res.status(200).json({ statusCode: 200, portfolio });
  } catch (error) {
    logger.error({ message: 'Get Portfolio By Slug Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve portfolio details' });
  }
};
