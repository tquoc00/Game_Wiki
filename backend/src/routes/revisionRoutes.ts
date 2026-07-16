import { Router } from 'express';
import { getArticleRevisions, getRevisionById } from '../controllers/revisionController';

const router = Router();

// Retrieve revisions of an article
router.get('/articles/:slug/revisions', getArticleRevisions);

// Retrieve details of a single revision snapshot
router.get('/revisions/:id', getRevisionById);

export default router;
