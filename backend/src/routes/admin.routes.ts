import { Router } from 'express';
import { 
  getDashboardStats, getAllLeads, getLeadDetails, updateLeadStatus, exportLeadsCSV,
  getAllUsers, createService, updateService, deleteService, createTemplate, updateTemplate, deleteTemplate
} from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN']));

router.get('/stats', getDashboardStats);
router.get('/leads', getAllLeads);
router.get('/leads/:id', getLeadDetails);
router.patch('/leads/:id', updateLeadStatus);
router.get('/export', exportLeadsCSV);

// User database endpoints
router.get('/users', getAllUsers);

// Services CRUD catalog
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Templates CRUD catalog
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

export default router;
