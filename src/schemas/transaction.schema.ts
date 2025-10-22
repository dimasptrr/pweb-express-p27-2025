import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    user_id: z.string().cuid('Invalid user ID'),
    items: z.array(
      z.object({
        book_id: z.string().cuid('Invalid book ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    ).min(1, 'At least one item is required'),
  }),
});

export const transactionParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid transaction ID'),
  }),
});


export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type TransactionParamInput = z.infer<typeof transactionParamSchema>;
