import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { ResponseFormatter } from '../utils/response.util';

export const LibraryController = {
  // POST /books - Create new book
  async createBook(req: Request, res: Response) {
    try {
      const { title, writer, publisher, publication_year, description, price, stock_quantity, genre_id } = req.body;

      // Check if genre exists
      const genre = await prisma.genre.findFirst({
        where: {
          id: genre_id,
          deletedAt: null,
        },
      });

      if (!genre) {
        return ResponseFormatter.notFound(res, 'Genre not found');
      }

      // Check if book with same title already exists
      const existingBook = await prisma.book.findFirst({
        where: {
          title,
          deletedAt: null,
        },
      });

      if (existingBook) {
        return ResponseFormatter.badRequest(res, 'Book with this title already exists');
      }

      // Create book
      const book = await prisma.book.create({
        data: {
          title,
          writer,
          publisher,
          publicationYear: publication_year,
          description,
          price,
          stockQuantity: stock_quantity,
          genreId: genre_id,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      });

      return ResponseFormatter.created(res, 'Book added successfully', {
        id: book.id,
        title: book.title,
        created_at: book.createdAt,
      });
    } catch (error: any) {
      console.error('Error creating book:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to create book');
    }
  },

  // GET /books - Get all books with pagination and filters
  async getAllBooks(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, orderByTitle, orderByPublishDate } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build where clause
      const where: any = {
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { title: { contains: String(search), mode: 'insensitive' } },
          { writer: { contains: String(search), mode: 'insensitive' } },
          { publisher: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Build orderBy clause
      const orderBy: any = [];
      if (orderByTitle) {
        orderBy.push({ title: orderByTitle });
      }
      if (orderByPublishDate) {
        orderBy.push({ publicationYear: orderByPublishDate });
      }
      if (orderBy.length === 0) {
        orderBy.push({ createdAt: 'desc' });
      }

      // Get books
      const books = await prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        select: {
          id: true,
          title: true,
          writer: true,
          publisher: true,
          description: true,
          publicationYear: true,
          price: true,
          stockQuantity: true,
          genre: {
            select: {
              name: true,
            },
          },
        },
      });

      // Format response
      const formattedBooks = books.map((book) => ({
        id: book.id,
        title: book.title,
        writer: book.writer,
        publisher: book.publisher,
        description: book.description,
        publication_year: book.publicationYear,
        price: book.price,
        stock_quantity: book.stockQuantity,
        genre: book.genre.name,
      }));

      // Calculate pagination meta
      const total = await prisma.book.count({ where });
      const totalPages = Math.ceil(total / Number(limit));
      const currentPage = Number(page);

      return ResponseFormatter.success(res, 'Get all book successfully', formattedBooks, 200);
    } catch (error: any) {
      console.error('Error getting books:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to get books');
    }
  },

  // GET /books/:id - Get book detail
  async getBookDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const book = await prisma.book.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          writer: true,
          publisher: true,
          description: true,
          publicationYear: true,
          price: true,
          stockQuantity: true,
          genre: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!book) {
        return ResponseFormatter.notFound(res, 'Book not found');
      }

      const formattedBook = {
        id: book.id,
        title: book.title,
        writer: book.writer,
        publisher: book.publisher,
        description: book.description,
        publication_year: book.publicationYear,
        price: book.price,
        stock_quantity: book.stockQuantity,
        genre: book.genre.name,
      };

      return ResponseFormatter.success(res, 'Get book detail successfully', formattedBook);
    } catch (error: any) {
      console.error('Error getting book detail:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to get book detail');
    }
  },

  // GET /books/genre/:id - Get books by genre
  async getBooksByGenre(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10, search, orderByTitle, orderByPublishDate } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Check if genre exists
      const genre = await prisma.genre.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!genre) {
        return ResponseFormatter.notFound(res, 'Genre not found');
      }

      // Build where clause
      const where: any = {
        genreId: id,
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { title: { contains: String(search), mode: 'insensitive' } },
          { writer: { contains: String(search), mode: 'insensitive' } },
          { publisher: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      // Build orderBy clause
      const orderBy: any = [];
      if (orderByTitle) {
        orderBy.push({ title: orderByTitle });
      }
      if (orderByPublishDate) {
        orderBy.push({ publicationYear: orderByPublishDate });
      }
      if (orderBy.length === 0) {
        orderBy.push({ createdAt: 'desc' });
      }

      // Get books
      const books = await prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        select: {
          id: true,
          title: true,
          writer: true,
          publisher: true,
          description: true,
          publicationYear: true,
          price: true,
          stockQuantity: true,
          genre: {
            select: {
              name: true,
            },
          },
        },
      });

      // Format response
      const formattedBooks = books.map((book) => ({
        id: book.id,
        title: book.title,
        writer: book.writer,
        publisher: book.publisher,
        description: book.description,
        genre: book.genre.name,
        publication_year: book.publicationYear,
        price: book.price,
        stock_quantity: book.stockQuantity,
      }));

      // Calculate pagination meta
      const total = await prisma.book.count({ where });
      const totalPages = Math.ceil(total / Number(limit));
      const currentPage = Number(page);

      return ResponseFormatter.success(res, 'Get all book by genre successfully', formattedBooks, 200);
    } catch (error: any) {
      console.error('Error getting books by genre:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to get books by genre');
    }
  },

  // PATCH /books/:id - Update book (only description, price, stock_quantity)
  async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description, price, stock_quantity } = req.body;

      // Check if book exists
      const existingBook = await prisma.book.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingBook) {
        return ResponseFormatter.notFound(res, 'Book not found');
      }

      // Build update data
      const updateData: any = {};
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (stock_quantity !== undefined) updateData.stockQuantity = stock_quantity;

      // Update book
      const updatedBook = await prisma.book.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      });

      return ResponseFormatter.success(res, 'Book updated successfully', {
        id: updatedBook.id,
        title: updatedBook.title,
        updated_at: updatedBook.updatedAt,
      });
    } catch (error: any) {
      console.error('Error updating book:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to update book');
    }
  },

  // DELETE /books/:id - Soft delete book
  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if book exists
      const existingBook = await prisma.book.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingBook) {
        return ResponseFormatter.notFound(res, 'Book not found');
      }

      // Soft delete (set deletedAt)
      await prisma.book.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return ResponseFormatter.success(res, 'Book removed successfully');
    } catch (error: any) {
      console.error('Error deleting book:', error);
      return ResponseFormatter.error(res, error.message || 'Failed to delete book');
    }
  },
};
