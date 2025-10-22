import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export class ResponseFormatter {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, data?: any, statusCode: number = 500) {
    const response: ApiResponse = {
      success: false,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, message: string, data?: T) {
    return this.success(res, message, data, 201);
  }

  static notFound(res: Response, message: string = 'Resource not found', data?: any) {
    return this.error(res, message, data, 404);
  }

  static badRequest(res: Response, message: string, data?: any) {
    return this.error(res, message, data, 400);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized', data?: any) {
    return this.error(res, message, data, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden', data?: any) {
    return this.error(res, message, data, 403);
  }
}
