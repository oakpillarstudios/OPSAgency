import { Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';

export const getDashboardStats = async (_req: TracedRequest, res: Response) => {
  try {
    const totalLeads = await prisma.user.count({ where: { role: 'USER' } });
    const totalQuotes = await prisma.quoteRequest.count();
    const totalConsultations = await prisma.consultation.count();
    const totalActivities = await prisma.leadActivity.count();

    // Today's new signups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newSignupsToday = await prisma.user.count({
      where: {
        createdAt: { gte: today },
        role: 'USER'
      }
    });

    // Lead Pipeline status aggregation
    const quotesByStatus = await prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Top visited services based on activity log
    const serviceViews = await prisma.leadActivity.groupBy({
      by: ['details'],
      where: { action: 'VIEW_SERVICE' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // Recent notifications
    const recentLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return res.status(200).json({
      statusCode: 200,
      stats: {
        totalLeads,
        totalQuotes,
        totalConsultations,
        totalActivities,
        newSignupsToday,
        quotesByStatus,
        serviceViews,
        recentLogs
      }
    });
  } catch (error) {
    logger.error({ message: 'Get Dashboard Stats Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve admin stats' });
  }
};

export const getAllLeads = async (req: TracedRequest, res: Response) => {
  try {
    const { search, industry, businessType, minScore } = req.query;

    const where: any = { role: 'USER' };

    if (industry) {
      where.industry = String(industry);
    }
    if (businessType) {
      where.businessType = String(businessType);
    }
    if (minScore) {
      where.leadScore = { gte: parseInt(String(minScore)) };
    }
    if (search) {
      const searchStr = String(search).toLowerCase();
      where.OR = [
        { name: { contains: searchStr } },
        { email: { contains: searchStr } },
        { phone: { contains: searchStr } },
        { company: { contains: searchStr } }
      ];
    }

    // Leads list ordered by score (highest priority first)
    const leads = await prisma.user.findMany({
      where,
      orderBy: { leadScore: 'desc' },
      include: {
        quotes: { select: { id: true, status: true, budget: true } },
        consultations: { select: { id: true, status: true, preferredDate: true } }
      }
    });

    return res.status(200).json({ statusCode: 200, leads });
  } catch (error) {
    logger.error({ message: 'Get All Leads Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve CRM leads' });
  }
};

export const getLeadDetails = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const lead = await prisma.user.findFirst({
      where: { id, role: 'USER' },
      include: {
        activities: { orderBy: { timestamp: 'desc' } },
        quotes: { orderBy: { createdAt: 'desc' } },
        consultations: { orderBy: { preferredDate: 'desc' } },
        savedServices: { include: { service: true } },
        savedTemplates: { include: { template: true } }
      }
    });

    if (!lead) {
      return res.status(404).json({ statusCode: 404, message: 'Lead not found.' });
    }

    return res.status(200).json({ statusCode: 200, lead });
  } catch (error) {
    logger.error({ message: 'Get Lead Details Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to fetch lead profile details' });
  }
};

export const updateLeadStatus = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, leadScore, disabled } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role || user.role,
        leadScore: leadScore !== undefined ? parseInt(leadScore) : user.leadScore,
        disabled: disabled !== undefined ? !!disabled : user.disabled
      }
    });

    // Audit logs for admin actions
    await prisma.auditLog.create({
      data: {
        user: req.user?.email || 'Admin',
        action: 'UPDATE_USER',
        ip: req.ip,
        browser: req.headers['user-agent']
      }
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'User status updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    logger.error({ message: 'Update Lead Status Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to update user status' });
  }
};

export const exportLeadsCSV = async (_req: TracedRequest, res: Response) => {
  try {
    const leads = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { leadScore: 'desc' }
    });

    let csvContent = 'ID,Name,Email,Phone,WhatsApp,Company,Business Type,Industry,City,Country,Lead Score,Created At\n';
    
    leads.forEach((l) => {
      csvContent += `"${l.id}","${l.name || ''}","${l.email}","${l.phone || ''}","${l.whatsApp || ''}","${l.company || ''}","${l.businessType || ''}","${l.industry || ''}","${l.city || ''}","${l.country || ''}",${l.leadScore},"${l.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=oakpillar_crm_leads.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    logger.error({ message: 'Export Leads CSV Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to export CRM data' });
  }
};

// GET /admin/users - List all users
export const getAllUsers = async (_req: TracedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ statusCode: 200, users });
  } catch (error) {
    logger.error({ message: 'Get All Users Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve user database' });
  }
};

// Services CRUD
export const createService = async (req: TracedRequest, res: Response) => {
  try {
    const { slug, title, shortDesc, longDesc, features, timeline, priceFrom, priceTo, featuredImage, techStack, popular, featured } = req.body;

    let category = await prisma.serviceCategory.findFirst();
    if (!category) {
      category = await prisma.serviceCategory.create({
        data: { name: 'General Services', slug: 'general-services' }
      });
    }

    const newService = await prisma.service.create({
      data: {
        categoryId: category.id,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        shortDesc,
        longDesc,
        features: Array.isArray(features) ? JSON.stringify(features) : features || '[]',
        timeline,
        priceFrom: parseFloat(priceFrom),
        priceTo: priceTo ? parseFloat(priceTo) : null,
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
        techStack: Array.isArray(techStack) ? JSON.stringify(techStack) : techStack || '[]',
        popular: !!popular,
        featured: !!featured
      }
    });

    await prisma.auditLog.create({
      data: { user: req.user?.email || 'Admin', action: 'CREATE_SERVICE', ip: req.ip }
    });

    return res.status(201).json({ statusCode: 201, service: newService });
  } catch (error) {
    logger.error({ message: 'Create Service Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to create service' });
  }
};

export const updateService = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, shortDesc, longDesc, features, timeline, priceFrom, priceTo, featuredImage, techStack, popular, featured } = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title,
        shortDesc,
        longDesc,
        features: Array.isArray(features) ? JSON.stringify(features) : features,
        timeline,
        priceFrom: parseFloat(priceFrom),
        priceTo: priceTo ? parseFloat(priceTo) : null,
        featuredImage,
        techStack: Array.isArray(techStack) ? JSON.stringify(techStack) : techStack,
        popular: !!popular,
        featured: !!featured
      }
    });

    await prisma.auditLog.create({
      data: { user: req.user?.email || 'Admin', action: 'UPDATE_SERVICE', ip: req.ip }
    });

    return res.status(200).json({ statusCode: 200, service: updated });
  } catch (error) {
    logger.error({ message: 'Update Service Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to update service' });
  }
};

export const deleteService = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { user: req.user?.email || 'Admin', action: 'DELETE_SERVICE', ip: req.ip }
    });

    return res.status(200).json({ statusCode: 200, message: 'Service deleted successfully' });
  } catch (error) {
    logger.error({ message: 'Delete Service Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to delete service' });
  }
};

// Templates CRUD
export const createTemplate = async (req: TracedRequest, res: Response) => {
  try {
    const { slug, name, category, industry, description, technology, primaryColor, thumbnail, gallery, responsive, seoReady } = req.body;

    const newTemplate = await prisma.template.create({
      data: {
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        category,
        industry,
        description,
        technology,
        primaryColor,
        thumbnail,
        gallery: Array.isArray(gallery) ? JSON.stringify(gallery) : gallery || '[]',
        responsive: !!responsive,
        seoReady: !!seoReady
      }
    });

    await prisma.auditLog.create({
      data: { user: req.user?.email || 'Admin', action: 'CREATE_TEMPLATE', ip: req.ip }
    });

    return res.status(201).json({ statusCode: 201, template: newTemplate });
  } catch (error) {
    logger.error({ message: 'Create Template Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to create template' });
  }
};

export const updateTemplate = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, industry, description, technology, primaryColor, thumbnail, gallery, responsive, seoReady } = req.body;

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name,
        category,
        industry,
        description,
        technology,
        primaryColor,
        thumbnail,
        gallery: Array.isArray(gallery) ? JSON.stringify(gallery) : gallery,
        responsive: !!responsive,
        seoReady: !!seoReady
      }
    });

    await prisma.auditLog.create({
      data: { user: req.user?.email || 'Admin', action: 'UPDATE_TEMPLATE', ip: req.ip }
    });

    return res.status(200).json({ statusCode: 200, template: updated });
  } catch (error) {
    logger.error({ message: 'Update Template Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to update template' });
  }
};

export const deleteTemplate = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.template.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { user: req.user?.email || 'Admin', action: 'DELETE_TEMPLATE', ip: req.ip }
    });

    return res.status(200).json({ statusCode: 200, message: 'Template deleted successfully' });
  } catch (error) {
    logger.error({ message: 'Delete Template Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to delete template' });
  }
};
