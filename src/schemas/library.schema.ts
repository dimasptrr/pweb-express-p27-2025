import { z } from 'zod';

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    writer: z.string().min(1, 'Writer is required'),
    publisher: z.string().min(1, 'Publisher is required'),
    publication_year: z.number().int().positive('Publication year must be positive'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    stock_quantity: z.number().int().nonnegative('Stock quantity cannot be negative'),
    genre_id: z.string().min(1, 'Genre ID is required'),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid book ID'),
  }),
  body: z.object({
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock_quantity: z.number().int().nonnegative().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const bookParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid book ID'),
  }),
});

export const getAllBooksSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    orderByTitle: z.enum(['asc', 'desc']).optional(),
    orderByPublishDate: z.enum(['asc', 'desc']).optional(),
  }),
});

export const getBooksByGenreSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Invalid genre ID'),
  }),
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    orderByTitle: z.enum(['asc', 'desc']).optional(),
    orderByPublishDate: z.enum(['asc', 'desc']).optional(),
  }),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type BookParamInput = z.infer<typeof bookParamSchema>;
export type GetAllBooksInput = z.infer<typeof getAllBooksSchema>;
export type GetBooksByGenreInput = z.infer<typeof getBooksByGenreSchema>;
