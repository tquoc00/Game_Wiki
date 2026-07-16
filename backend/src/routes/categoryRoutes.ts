import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { requireRole } from '../middlewares/authMiddleware';
import { Role } from '../generated/prisma/client';

const router = Router();

router.get('/', getCategories);
router.post('/', requireRole(Role.EDITOR), createCategory);

export default router;
