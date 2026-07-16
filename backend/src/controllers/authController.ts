import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../lib/db';
import { signToken } from '../lib/auth';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

/**
 * REGISTER a new user
 */
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ các trường thông tin.' });
    }

    // Check if email or username already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { username: username.trim() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.trim().toLowerCase()) {
        return res.status(400).json({ error: 'Địa chỉ email đã được sử dụng.' });
      }
      return res.status(400).json({ error: 'Tên người dùng đã được sử dụng.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'USER', // Default role is USER
      },
    });

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ nội bộ trong quá trình đăng ký.' });
  }
}

/**
 * LOGIN user & establish session cookie
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu.' });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ trong quá trình đăng nhập.' });
  }
}

/**
 * LOGOUT user & clear cookie
 */
export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({ message: 'Đăng xuất thành công.' });
  } catch (error: any) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
  }
}

/**
 * FETCH current logged-in user profile
 */
export async function me(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Chưa đăng nhập.' });
  }
  return res.status(200).json({ user: req.user });
}
