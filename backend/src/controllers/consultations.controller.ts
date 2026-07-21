import { Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';
import { sendConsultationAlert } from '../utils/email';

export const createConsultation = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }

    const { preferredDate, preferredTime, timezone, contactMethod, notes } = req.body;

    if (!preferredDate || !preferredTime || !timezone || !contactMethod) {
      return res.status(400).json({ statusCode: 400, message: 'Preferred Date, Time, Timezone, and Contact Method are required.' });
    }

    const consultation = await prisma.consultation.create({
      data: {
        userId,
        preferredDate: new Date(preferredDate),
        preferredTime,
        timezone,
        contactMethod,
        notes: notes || null,
        status: 'NEW'
      }
    });

    // Update User lead score (+40 for consultation booking)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          leadScore: user.leadScore + 40
        }
      });
      
      // Dispatch emails asynchronously
      sendConsultationAlert(user.email, user.name, consultation).catch(err => {
        logger.error({ message: 'Failed to send consultation emails', error: err instanceof Error ? err.message : err });
      });
    }


    // Log Activity
    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'CONSULTATION_REQUEST',
        details: `Booked a consultation via ${contactMethod} for ${preferredDate} at ${preferredTime} (${timezone}).`
      }
    });

    // Create user notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Consultation Scheduled',
        description: `Your consultation request for ${preferredDate} at ${preferredTime} (${timezone}) via ${contactMethod} has been registered.`,
        type: 'INFO'
      }
    });

    logger.info({ message: 'New Consultation booked', userId, consultationId: consultation.id });

    return res.status(201).json({ statusCode: 201, message: 'Consultation scheduled successfully.', consultation });
  } catch (error) {
    logger.error({ message: 'Create Consultation Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to schedule consultation' });
  }
};

export const getUserConsultations = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }

    const consultations = await prisma.consultation.findMany({
      where: { userId },
      orderBy: { preferredDate: 'desc' }
    });

    return res.status(200).json({ statusCode: 200, consultations });
  } catch (error) {
    logger.error({ message: 'Get User Consultations Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to fetch your consultation list' });
  }
};
