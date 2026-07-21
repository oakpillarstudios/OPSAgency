import { Router } from 'express';
import { createQuote, getUserQuotes } from '../controllers/quotes.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);
router.post('/', createQuote);
router.get('/my-quotes', getUserQuotes);

export default router;
