import { Router } from 'express';
import { getAllTemplates, getTemplateBySlug, saveTemplate, unsaveTemplate } from '../controllers/templates.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllTemplates);
router.get('/:slug', getTemplateBySlug);
router.post('/save', requireAuth, saveTemplate);
router.delete('/save/:templateId', requireAuth, unsaveTemplate);

export default router;
