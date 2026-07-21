import { Router } from 'express';
import { getAllServices, getServiceBySlug, saveService, unsaveService } from '../controllers/services.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);
router.post('/save', requireAuth, saveService);
router.delete('/save/:serviceId', requireAuth, unsaveService);

export default router;
