import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ResponseFormatter } from '../utils/response.util';

export const AuthController = {
  // POST /auth/register
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return ResponseFormatter.badRequest(res, 'Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: username || email.split('@')[0],
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      return ResponseFormatter.created(res, 'User registered successfully', {
        id: user.id,
        email: user.email,
        created_at: user.createdAt,
      });
    } catch (error: any) {
      console.error('Register error:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to register user');
    }
  },

  // POST /auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return ResponseFormatter.unauthorized(res, 'Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ResponseFormatter.unauthorized(res, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      return ResponseFormatter.success(res, 'Login successfully', {
        access_token: token,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to login');
    }
  },

  // GET /auth/me
  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return ResponseFormatter.unauthorized(res, 'User not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      if (!user) {
        return ResponseFormatter.notFound(res, 'User not found');
      }

      return ResponseFormatter.success(res, 'Get me successfully', user);
    } catch (error: any) {
      console.error('Get me error:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to get user data');
    }
  },
};
