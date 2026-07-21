import { Request, Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';

export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const { category, industry, technology, search } = req.query;

    const where: any = {};

    if (category) {
      where.category = String(category);
    }

    if (industry) {
      where.industry = String(industry);
    }

    if (technology) {
      where.technology = { contains: String(technology) };
    }

    if (search) {
      const searchStr = String(search).toLowerCase();
      where.OR = [
        { name: { contains: searchStr } },
        { description: { contains: searchStr } },
        { industry: { contains: searchStr } },
        { category: { contains: searchStr } }
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ statusCode: 200, templates });
  } catch (error) {
    logger.error({ message: 'Get All Templates Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve website templates' });
  }
};

export const getTemplateBySlug = async (req: TracedRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const template = await prisma.template.findUnique({
      where: { slug }
    });

    if (!template) {
      return res.status(404).json({ statusCode: 404, message: 'Template not found.' });
    }

    // Log Activity and increase lead score if user is logged in
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.user.update({
          where: { id: userId },
          data: { leadScore: user.leadScore + 2 } // +2 for viewing a template
        });

        await prisma.leadActivity.create({
          data: {
            userId,
            action: 'VIEW_TEMPLATE',
            details: `Viewed template detail: ${template.name}`
          }
        });
      }
    }

    // Dynamic Recommendations
    // 1. Similar templates (same category/industry, excluding current)
    const similarTemplates = await prisma.template.findMany({
      where: {
        OR: [
          { category: template.category },
          { industry: template.industry }
        ],
        NOT: { id: template.id }
      },
      take: 3
    });

    // 2. Recommended Services (e.g. Website Maintenance, Hosting, or custom software related to category)
    const recommendedServices = await prisma.service.findMany({
      where: {
        OR: [
          { slug: { contains: 'website' } },
          { slug: { contains: 'maintenance' } }
        ]
      },
      take: 3
    });

    return res.status(200).json({
      statusCode: 200,
      template,
      recommendations: {
        similarTemplates,
        recommendedServices
      }
    });
  } catch (error) {
    logger.error({ message: 'Get Template By Slug Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve template details' });
  }
};

export const saveTemplate = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { templateId } = req.body;

    if (!userId || !templateId) {
      return res.status(400).json({ statusCode: 400, message: 'User ID and Template ID are required.' });
    }

    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) {
      return res.status(404).json({ statusCode: 404, message: 'Template not found.' });
    }

    const existingBookmark = await prisma.savedTemplate.findUnique({
      where: {
        userId_templateId: { userId, templateId }
      }
    });

    if (existingBookmark) {
      return res.status(400).json({ statusCode: 400, message: 'Template already saved.' });
    }

    await prisma.savedTemplate.create({
      data: { userId, templateId }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: { leadScore: user.leadScore + 5 } // +5 for bookmarking a template
      });
    }

    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'SAVE_TEMPLATE',
        details: `Saved template to bookmark: ${template.name}`
      }
    });

    logger.info({ message: 'User bookmarked template', userId, templateId });
    return res.status(201).json({ statusCode: 201, message: 'Template saved successfully.' });
  } catch (error) {
    logger.error({ message: 'Save Template Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to bookmark template' });
  }
};

export const unsaveTemplate = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { templateId } = req.params;

    if (!userId || !templateId) {
      return res.status(400).json({ statusCode: 400, message: 'User ID and Template ID are required.' });
    }

    const existingBookmark = await prisma.savedTemplate.findUnique({
      where: {
        userId_templateId: { userId, templateId }
      }
    });

    if (!existingBookmark) {
      return res.status(404).json({ statusCode: 404, message: 'Saved template not found.' });
    }

    await prisma.savedTemplate.delete({
      where: {
        userId_templateId: { userId, templateId }
      }
    });

    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'UNSAVE_TEMPLATE',
        details: `Removed template from bookmarks`
      }
    });

    logger.info({ message: 'User removed bookmarked template', userId, templateId });
    return res.status(200).json({ statusCode: 200, message: 'Template removed from bookmarks.' });
  } catch (error) {
    logger.error({ message: 'Unsave Template Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to remove bookmarked template' });
  }
};
