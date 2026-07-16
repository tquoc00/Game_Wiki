import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { db } from './db';
import { Role } from '../generated/prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-game-wiki-key';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  role: Role;
}

/**
 * Sign a new JWT token for user session
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieve current user from Express Request (Cookie or Bearer Token)
 */
export async function getCurrentUser(req: Request) {
  try {
    let token = '';

    // Check authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    if (!token && req.cookies) {
      token = req.cookies['token'];
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Check if the user is authorized for a specific minimum role
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy: Record<Role, number> = {
    USER: 1,
    EDITOR: 2,
    ADMIN: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
