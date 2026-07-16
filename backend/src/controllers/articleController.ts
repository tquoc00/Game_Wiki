import { Request, Response } from 'express';
import { db } from '../lib/db';
import { slugify } from '../utils/slugify';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

/**
 * GET all articles with pagination, search, category, and game filtering
 */
export async function getArticles(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const search = (req.query.search as string) || '';
    const categorySlug = (req.query.category as string) || '';
    const gameSlug = (req.query.gameSlug as string) || '';

    const skip = (page - 1) * limit;

    // Build Prisma query filters
    const whereClause: any = { published: true };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (gameSlug) {
      whereClause.game = {
        slug: gameSlug,
      };
    }

    // Execute queries in parallel
    const [articles, totalCount] = await Promise.all([
      db.article.findMany({
        where: whereClause,
        include: {
          author: { select: { username: true } },
          category: { select: { name: true, slug: true } },
          game: { select: { name: true, slug: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.article.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      articles,
      pagination: {
        total: totalCount,
        pages: totalPages,
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải danh sách bài viết.' });
  }
}

/**
 * GET a single article by slug and gameSlug
 */
export async function getArticleBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const { gameSlug } = req.query;

    const whereClause: any = { slug };
    if (gameSlug) {
      whereClause.game = { slug: String(gameSlug) };
    }

    const article = await db.article.findFirst({
      where: whereClause,
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        game: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { revisions: true },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    return res.status(200).json({ article });
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải chi tiết bài viết.' });
  }
}

/**
 * CREATE a new article (Requires EDITOR/ADMIN)
 */
export async function createArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Không có quyền thực hiện hành động này.' });
    }

    const { title, content, summary, featuredImg, categoryId, gameId, published } = req.body;

    if (!title || !content || !categoryId || !gameId) {
      return res.status(400).json({ error: 'Tiêu đề, nội dung, chuyên mục và trò chơi không được để trống.' });
    }

    const slug = slugify(title);

    // Check if slug is unique inside this game
    const existing = await db.article.findUnique({
      where: {
        slug_gameId: {
          slug,
          gameId,
        }
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Bài viết với tiêu đề này đã tồn tại trong trò chơi này.' });
    }

    // Create article and save initial revision in a transaction
    const newArticle = await db.$transaction(async (tx) => {
      const article = await tx.article.create({
        data: {
          title: title.trim(),
          slug,
          content,
          summary: summary ? summary.trim() : null,
          featuredImg: featuredImg || null,
          published: published !== undefined ? published : true,
          authorId: user.id,
          categoryId,
          gameId,
        },
      });

      await tx.revision.create({
        data: {
          articleId: article.id,
          userId: user.id,
          contentDiff: 'Khởi tạo phiên bản đầu tiên',
          fullContent: content,
          summary: 'Khởi tạo bài viết ban đầu',
        },
      });

      return article;
    });

    return res.status(201).json({
      message: 'Tạo bài viết thành công.',
      article: newArticle,
    });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tạo bài viết.' });
  }
}

/**
 * UPDATE an article (Requires EDITOR/ADMIN)
 */
export async function updateArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const { slug } = req.params;
    const { gameSlug } = req.query;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Không có quyền thực hiện hành động này.' });
    }

    const { title, content, summary, featuredImg, categoryId, published, editSummary } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({ error: 'Tiêu đề, nội dung và chuyên mục không được để trống.' });
    }

    const whereClause: any = { slug };
    if (gameSlug) {
      whereClause.game = { slug: String(gameSlug) };
    }

    // Find original state
    const oldArticle = await db.article.findFirst({
      where: whereClause,
    });

    if (!oldArticle) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    // Run transaction
    const updatedArticle = await db.$transaction(async (tx) => {
      // 1. Snapshot previous state into Revision
      await tx.revision.create({
        data: {
          articleId: oldArticle.id,
          userId: user.id,
          contentDiff: `Sửa đổi bởi ${user.username}`,
          fullContent: oldArticle.content,
          summary: editSummary ? editSummary.trim() : 'Cập nhật nội dung bài viết',
        },
      });

      // 2. Overwrite article with new state
      const article = await tx.article.update({
        where: { id: oldArticle.id },
        data: {
          title: title.trim(),
          content,
          summary: summary ? summary.trim() : null,
          featuredImg: featuredImg || null,
          published: published !== undefined ? published : true,
          categoryId,
        },
      });

      return article;
    });

    return res.status(200).json({
      message: 'Cập nhật bài viết thành công.',
      article: updatedArticle,
    });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật bài viết.' });
  }
}

/**
 * DELETE an article (Requires ADMIN only)
 */
export async function deleteArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const { slug } = req.params;
    const { gameSlug } = req.query;

    const whereClause: any = { slug };
    if (gameSlug) {
      whereClause.game = { slug: String(gameSlug) };
    }

    const article = await db.article.findFirst({
      where: whereClause,
    });

    if (!article) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    await db.article.delete({
      where: { id: article.id },
    });

    return res.status(200).json({ message: 'Xóa bài viết thành công.' });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi xóa bài viết.' });
  }
}
