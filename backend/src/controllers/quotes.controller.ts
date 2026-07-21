import { Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';
import { sendQuoteAlert } from '../utils/email';

export const createQuote = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }

    const { serviceName, templateName, budget, timeline, requirements } = req.body;

    if (!serviceName || !budget || !timeline || !requirements) {
      return res.status(400).json({ statusCode: 400, message: 'Service, Budget, Timeline, and Requirements are required.' });
    }

    // Create quote request
    const quote = await prisma.quoteRequest.create({
      data: {
        userId,
        serviceName,
        templateName: templateName || null,
        budget: parseFloat(budget),
        timeline,
        requirements,
        status: 'NEW'
      }
    });

    // Update User lead score (+50 for high intent action like quote request)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          leadScore: user.leadScore + 50
        }
      });
      
      // Send Resend automated emails
      sendQuoteAlert(user.email, user.name, quote).catch(err => {
        logger.error({ message: 'Failed to send quote emails', error: err instanceof Error ? err.message : err });
      });
    }


    // Log Activity
    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'QUOTE_REQUEST',
        details: `Requested quotation for service: ${serviceName}. Budget: $${budget}.`
      }
    });

    // Create confirmation notification for the user
    await prisma.notification.create({
      data: {
        userId,
        title: 'Quote Request Received',
        description: `We have received your quotation request for "${serviceName}". Our project executives will review your details and revert shortly.`,
        type: 'INFO'
      }
    });

    // Admin notification creation (user ID 'admin' can be linked or handled generically in dashboard alerts)
    logger.info({ message: 'New Quote Request submitted', userId, quoteId: quote.id });

    return res.status(201).json({ statusCode: 201, message: 'Quote request submitted successfully.', quote });
  } catch (error) {
    logger.error({ message: 'Create Quote Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to submit quote request' });
  }
};

export const getUserQuotes = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }

    const quotes = await prisma.quoteRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ statusCode: 200, quotes });
  } catch (error) {
    logger.error({ message: 'Get User Quotes Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to fetch your quotations' });
  }
};
