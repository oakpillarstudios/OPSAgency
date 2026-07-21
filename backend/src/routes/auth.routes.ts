import { Router } from 'express';
import { googleLogin, loginWithEmailPassword, completeRegistration, getProfile, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/google', googleLogin);
router.post('/login', loginWithEmailPassword);
router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);
router.patch('/profile/complete', requireAuth, completeRegistration);

export default router;
