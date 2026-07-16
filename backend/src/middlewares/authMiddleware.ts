import { Request, Response, NextFunction } from 'express';
import { getCurrentUser, hasRole } from '../lib/auth';
import { Role } from '../generated/prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: Role;
    avatarUrl: string | null;
    createdAt: Date;
  };
}

/**
 * Middleware to enforce authentication
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập để thực hiện hành động này.' });
  }
  req.user = user;
  next();
}

/**
 * Middleware to check for user roles
 */
export function requireRole(requiredRole: Role) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập để thực hiện hành động này.' });
    }
    if (!hasRole(user.role, requiredRole)) {
      return res.status(403).json({ error: 'Bạn không đủ quyền hạn để thực hiện hành động này.' });
    }
    req.user = user;
    next();
  };
}
