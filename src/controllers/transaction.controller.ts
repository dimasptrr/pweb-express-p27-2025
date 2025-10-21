import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { user_id, items } = req.body;

    // Validasi input
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'user_id and items are required, items must be a non-empty array' 
      });
    }

    // Validasi user exists
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validasi semua book_id dan check stock
    const bookIds = items.map(item => item.book_id);
    const books = await prisma.book.findMany({
      where: { 
        id: { in: bookIds },
        deletedAt: null 
      }
    });

    if (books.length !== items.length) {
      return res.status(404).json({ error: 'One or more books not found' });
    }

    // Check stock availability
    for (const item of items) {
      const book = books.find((b: any) => b.id === item.book_id);
      if (!book) {
        return res.status(404).json({ error: `Book with id ${item.book_id} not found` });
      }
      if (book.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for book "${book.title}". Available: ${book.stockQuantity}, Requested: ${item.quantity}` 
        });
      }
    }

    // Create transaction with items using Prisma transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user_id,
          items: {
            create: items.map(item => ({
              bookId: item.book_id,
              quantity: item.quantity
            }))
          }
        },
        include: {
          items: {
            include: {
              book: true
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      // Update stock quantity for each book
      for (const item of items) {
        await tx.book.update({
          where: { id: item.book_id },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return res.status(201).json({
      message: 'Transaction created successfully',
      data: order
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getAllTransaction = async (req: Request, res: Response) => {
};
export const getDetailTransaction = async (req: Request, res: Response) => {
};
export const getTransactionStatistics = async (req: Request, res: Response) => {
};