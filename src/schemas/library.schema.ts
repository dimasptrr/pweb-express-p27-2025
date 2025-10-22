import { z } from 'zod';

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    writer: z.string().min(1, 'Writer is required'),
    publisher: z.string().min(1, 'Publisher is required'),
    publicationYear: z.number().int().positive('Publication year must be positive'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    stockQuantity: z.number().int().nonnegative('Stock quantity cannot be negative'),
    genreId: z.string().cuid('Invalid genre ID'),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid book ID'),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    writer: z.string().min(1).optional(),
    publisher: z.string().min(1).optional(),
    publicationYear: z.number().int().positive().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    genreId: z.string().cuid().optional(),
  }),
});

export const bookParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid book ID'),
  }),
});


export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type BookParamInput = z.infer<typeof bookParamSchema>;
