import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseFormatter } from '../utils/response.util';

interface JwtPayload {
  userId: string;
  email: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseFormatter.unauthorized(res, 'No token provided');
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return ResponseFormatter.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return ResponseFormatter.unauthorized(res, 'Token expired');
    }
    return ResponseFormatter.unauthorized(res, 'Authentication failed');
  }
};
