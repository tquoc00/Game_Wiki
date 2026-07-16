import { Request, Response } from 'express';
import { db } from '../lib/db';

/**
 * GET all revisions for a specific article slug (under a specific game)
 */
export async function getArticleRevisions(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const { gameSlug } = req.query;

    const whereClause: any = { slug };
    if (gameSlug) {
      whereClause.game = { slug: String(gameSlug) };
    }

    const article = await db.article.findFirst({
      where: whereClause,
      select: { id: true },
    });

    if (!article) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    const revisions = await db.revision.findMany({
      where: { articleId: article.id },
      include: {
        user: {
          select: { username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ revisions });
  } catch (error: any) {
    console.error('Error fetching revisions:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải lịch sử sửa đổi.' });
  }
}

/**
 * GET a single revision detail by ID
 */
export async function getRevisionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const revision = await db.revision.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
        article: { 
          select: { 
            id: true, 
            title: true, 
            slug: true, 
            categoryId: true,
            game: { select: { slug: true } }
          } 
        },
      },
    });

    if (!revision) {
      return res.status(404).json({ error: 'Không tìm thấy phiên bản lưu trữ.' });
    }

    return res.status(200).json({ revision });
  } catch (error: any) {
    console.error('Error fetching revision detail:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải chi tiết phiên bản.' });
  }
}
