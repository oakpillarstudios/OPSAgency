import { Router } from 'express';
import { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogs.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin / Content Manager blog creation and modifications
router.post('/', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), createBlog);
router.put('/:id', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), updateBlog);
router.delete('/:id', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), deleteBlog);

export default router;
