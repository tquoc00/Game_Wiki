import { Request, Response } from 'express';
import { db } from '../lib/db';

/**
 * GET all games
 */
export async function getGames(req: Request, res: Response) {
  try {
    const games = await db.game.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            articles: true,
            categories: true,
          }
        }
      }
    });
    return res.status(200).json({ games });
  } catch (error: any) {
    console.error('Error fetching games:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải danh sách trò chơi.' });
  }
}

/**
 * GET a single game by slug
 */
export async function getGameBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const game = await db.game.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: true,
            categories: true,
          }
        }
      }
    });

    if (!game) {
      return res.status(404).json({ error: 'Không tìm thấy trò chơi yêu cầu.' });
    }

    return res.status(200).json({ game });
  } catch (error: any) {
    console.error('Error fetching game by slug:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi tải thông tin chi tiết trò chơi.' });
  }
}
