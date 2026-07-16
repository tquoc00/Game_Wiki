import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController';
import { requireRole } from '../middlewares/authMiddleware';
import { Role } from '../generated/prisma/client';

const router = Router();

router.get('/', getArticles);
router.post('/', requireRole(Role.EDITOR), createArticle);
router.get('/:slug', getArticleBySlug);
router.put('/:slug', requireRole(Role.EDITOR), updateArticle);
router.delete('/:slug', requireRole(Role.ADMIN), deleteArticle);

export default router;
