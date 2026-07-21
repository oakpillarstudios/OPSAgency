import { Router } from 'express';
import { createConsultation, getUserConsultations } from '../controllers/consultations.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);
router.post('/', createConsultation);
router.get('/my-consultations', getUserConsultations);

export default router;
