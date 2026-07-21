import { Request, Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, timeline, popular, featured } = req.query;

    const where: any = {};

    if (category) {
      where.category = { slug: String(category) };
    }

    if (popular) {
      where.popular = popular === 'true';
    }

    if (featured) {
      where.featured = featured === 'true';
    }

    if (minPrice || maxPrice) {
      where.priceFrom = {};
      if (minPrice) where.priceFrom.gte = parseFloat(String(minPrice));
      if (maxPrice) where.priceFrom.lte = parseFloat(String(maxPrice));
    }

    if (timeline) {
      where.timeline = { contains: String(timeline) };
    }

    if (search) {
      const searchStr = String(search).toLowerCase();
      where.OR = [
        { title: { contains: searchStr } },
        { shortDesc: { contains: searchStr } },
        { longDesc: { contains: searchStr } }
      ];
    }

    const services = await prisma.service.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ statusCode: 200, services });
  } catch (error) {
    logger.error({ message: 'Get All Services Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve services catalog' });
  }
};

export const getServiceBySlug = async (req: TracedRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const service = await prisma.service.findUnique({
      where: { slug },
      include: { category: true }
    });

    if (!service) {
      return res.status(404).json({ statusCode: 404, message: 'Service not found.' });
    }

    // Log Activity and increase lead score if user is logged in
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.user.update({
          where: { id: userId },
          data: { leadScore: user.leadScore + 2 } // +2 for viewing a service page
        });

        await prisma.leadActivity.create({
          data: {
            userId,
            action: 'VIEW_SERVICE',
            details: `Viewed service detail: ${service.title}`
          }
        });
      }
    }

    // Dynamic Recommendations
    // 1. Similar Services (same category, excluding current service)
    const similarServices = await prisma.service.findMany({
      where: {
        categoryId: service.categoryId,
        NOT: { id: service.id }
      },
      take: 3
    });

    // 2. Recommended Templates (matched by industry / keywords)
    const recommendedTemplates = await prisma.template.findMany({
      where: {
        industry: {
          contains: service.slug.split('-')[0] // Basic keyword match (e.g. restaurant-website matches restaurant template)
        }
      },
      take: 3
    });

    // 3. Fallback templates if none matched
    let finalTemplates = recommendedTemplates;
    if (recommendedTemplates.length === 0) {
      finalTemplates = await prisma.template.findMany({ take: 3 });
    }

    return res.status(200).json({
      statusCode: 200,
      service,
      recommendations: {
        similarServices,
        recommendedTemplates: finalTemplates
      }
    });
  } catch (error) {
    logger.error({ message: 'Get Service By Slug Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve service detail' });
  }
};

export const saveService = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { serviceId } = req.body;

    if (!userId || !serviceId) {
      return res.status(400).json({ statusCode: 400, message: 'User ID and Service ID are required.' });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({ statusCode: 404, message: 'Service not found.' });
    }

    const existingBookmark = await prisma.savedService.findUnique({
      where: {
        userId_serviceId: { userId, serviceId }
      }
    });

    if (existingBookmark) {
      return res.status(400).json({ statusCode: 400, message: 'Service already saved.' });
    }

    await prisma.savedService.create({
      data: { userId, serviceId }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: { leadScore: user.leadScore + 5 } // +5 for bookmarking a service
      });
    }

    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'SAVE_SERVICE',
        details: `Saved service to bookmark: ${service.title}`
      }
    });

    logger.info({ message: 'User bookmarked service', userId, serviceId });
    return res.status(201).json({ statusCode: 201, message: 'Service saved successfully.' });
  } catch (error) {
    logger.error({ message: 'Save Service Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to bookmark service' });
  }
};

export const unsaveService = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { serviceId } = req.params;

    if (!userId || !serviceId) {
      return res.status(400).json({ statusCode: 400, message: 'User ID and Service ID are required.' });
    }

    const existingBookmark = await prisma.savedService.findUnique({
      where: {
        userId_serviceId: { userId, serviceId }
      }
    });

    if (!existingBookmark) {
      return res.status(404).json({ statusCode: 404, message: 'Saved service not found.' });
    }

    await prisma.savedService.delete({
      where: {
        userId_serviceId: { userId, serviceId }
      }
    });

    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'UNSAVE_SERVICE',
        details: `Removed service from bookmarks`
      }
    });

    logger.info({ message: 'User removed bookmarked service', userId, serviceId });
    return res.status(200).json({ statusCode: 200, message: 'Service removed from bookmarks.' });
  } catch (error) {
    logger.error({ message: 'Unsave Service Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to remove bookmarked service' });
  }
};
