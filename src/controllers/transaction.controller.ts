import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'user_id and items are required, items must be a non-empty array',
        data: {}
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
        data: {}
      });
    }

    const bookIds = items.map(item => item.book_id);
    const books = await prisma.book.findMany({
      where: { 
        id: { in: bookIds },
        deletedAt: null 
      }
    });

    if (books.length !== items.length) {
      return res.status(404).json({ 
        success: false,
        message: 'One or more books not found',
        data: {}
      });
    }

    for (const item of items) {
      const book = books.find((b: any) => b.id === item.book_id);
      if (!book) {
        return res.status(404).json({ 
          success: false,
          message: `Book with id ${item.book_id} not found`,
          data: {}
        });
      }
      if (book.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Insufficient stock for book "${book.title}". Available: ${book.stockQuantity}, Requested: ${item.quantity}`,
          data: {}
        });
      }
    }

    const order = await prisma.$transaction(async (tx: any) => {
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

    const totalQuantity = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = order.items.reduce((sum: number, item: any) => sum + (item.book.price * item.quantity), 0);

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transaction_id: order.id,
        total_quantity: totalQuantity,
        total_price: totalPrice
      }
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      data: {}
    });
  }
};
export const getAllTransaction = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, orderById, orderByAmount, orderByPrice } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        {
          userId: {
            contains: search as string,
            mode: 'insensitive'
          }
        },
        {
          user: {
            OR: [
              { username: { contains: search as string, mode: 'insensitive' } },
              { email: { contains: search as string, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            book: {
              select: {
                price: true
              }
            }
          }
        }
      },
      skip,
      take,
    });

    let transactions = orders.map((order: any) => {
      const totalQuantity = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      const totalPrice = order.items.reduce((sum: number, item: any) => sum + (item.book.price * item.quantity), 0);
      
      return {
        id: order.id,
        total_quantity: totalQuantity,
        total_price: totalPrice
      };
    });

    if (orderById === 'desc') {
      transactions = transactions.sort((a, b) => b.id.localeCompare(a.id));
    } else if (orderById === 'asc') {
      transactions = transactions.sort((a, b) => a.id.localeCompare(b.id));
    }

    if (orderByAmount === 'desc') {
      transactions = transactions.sort((a, b) => b.total_price - a.total_price);
    } else if (orderByAmount === 'asc') {
      transactions = transactions.sort((a, b) => a.total_price - b.total_price);
    }
    if (orderByPrice === 'desc') {
      transactions = transactions.sort((a, b) => b.total_price - a.total_price);
    } else if (orderByPrice === 'asc') {
      transactions = transactions.sort((a, b) => a.total_price - b.total_price);
    }
    return res.status(200).json({
      success: true,
      message: 'Get all transaction successfully',
      data: transactions
    });

  } catch (error) {
    console.error('Error getting transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: []
    });
  }
};
export const getDetailTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
        data: {}
      });
    }

    const items = order.items.map((item: any) => ({
      book_id: item.book.id,
      book_title: item.book.title,
      quantity: item.quantity,
      subtotal_price: item.book.price * item.quantity
    }));

    const totalQuantity = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = order.items.reduce((sum: number, item: any) => sum + (item.book.price * item.quantity), 0);

    return res.status(200).json({
      success: true,
      message: 'Get transaction detail successfully',
      data: {
        id: order.id,
        items,
        total_quantity: totalQuantity,
        total_price: totalPrice
      }
    });

  } catch (error) {
    console.error('Error getting transaction detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: {}
    });
  }
};
export const getTransactionStatistics = async (req: Request, res: Response) => {
  try {
    const totalTransactions = await prisma.order.count();

    const allOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            book: {
              select: {
                price: true,
                genreId: true
              }
            }
          }
        }
      }
    });

    let totalAmount = 0;
    const genreSales: { [key: string]: number } = {};

    for (const order of allOrders) {
      let orderTotal = 0;
      for (const item of order.items) {
        const itemTotal = (item as any).book.price * item.quantity;
        orderTotal += itemTotal;

        const genreId = (item as any).book.genreId;
        if (!genreSales[genreId]) {
          genreSales[genreId] = 0;
        }
        genreSales[genreId] += item.quantity;
      }
      totalAmount += orderTotal;
    }

    const averageTransactionAmount = totalTransactions > 0 
      ? Math.round(totalAmount / totalTransactions) 
      : 0;

    let mostSalesGenreId = '';
    let fewestSalesGenreId = '';
    let maxSales = -1;
    let minSales = Infinity;

    for (const [genreId, sales] of Object.entries(genreSales)) {
      if (sales > maxSales) {
        maxSales = sales;
        mostSalesGenreId = genreId;
      }
      if (sales < minSales) {
        minSales = sales;
        fewestSalesGenreId = genreId;
      }
    }

    const genres = await prisma.genre.findMany({
      where: {
        id: {
          in: [mostSalesGenreId, fewestSalesGenreId]
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    const mostSalesGenre = genres.find((g: any) => g.id === mostSalesGenreId);
    const fewestSalesGenre = genres.find((g: any) => g.id === fewestSalesGenreId);

    return res.status(200).json({
      success: true,
      message: 'Get transactions statistics successfully',
      data: {
        total_transactions: totalTransactions,
        average_transaction_amount: averageTransactionAmount,
        fewest_book_sales_genre: fewestSalesGenre?.name || 'N/A',
        most_book_sales_genre: mostSalesGenre?.name || 'N/A'
      }
    });

  } catch (error) {
    console.error('Error getting transaction statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: {}
    });
  }
};