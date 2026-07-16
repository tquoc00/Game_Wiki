import { Request, Response } from 'express';
import { db } from '../lib/db';
import { slugify } from '../utils/slugify';

/**
 * GET all categories (optionally filtered by gameId or gameSlug)
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const { gameId, gameSlug } = req.query;
    const whereClause: any = {};

    if (gameId) {
      whereClause.gameId = String(gameId);
    }
    if (gameSlug) {
      whereClause.game = { slug: String(gameSlug) };
    }

    const categories = await db.category.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
    return res.status(200).json({ categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải danh mục.' });
  }
}

/**
 * CREATE a new category (Requires EDITOR/ADMIN)
 */
export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description, gameId } = req.body;

    if (!name || !gameId) {
      return res.status(400).json({ error: 'Tên danh mục và ID trò chơi không được để trống.' });
    }

    const slug = slugify(name);

    // Check if category already exists under this game
    const existing = await db.category.findUnique({
      where: {
        slug_gameId: {
          slug,
          gameId,
        }
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Danh mục này đã tồn tại trong trò chơi này.' });
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description ? description.trim() : null,
        gameId,
      },
    });

    return res.status(201).json({
      message: 'Tạo danh mục thành công.',
      category,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tạo danh mục.' });
  }
}
