import { z } from 'zod';

// Schema untuk membuat transaksi baru
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

// Schema untuk menambah item ke order
export const addOrderItemSchema = z.object({
  params: z.object({
    orderId: z.string().cuid('Invalid order ID'),
  }),
  body: z.object({
    book_id: z.string().cuid('Invalid book ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
  }),
});

// Schema untuk update order item
export const updateOrderItemSchema = z.object({
  params: z.object({
    orderId: z.string().cuid('Invalid order ID'),
    itemId: z.string().cuid('Invalid item ID'),
  }),
  body: z.object({
    quantity: z.number().int().positive('Quantity must be positive'),
  }),
});

// Schema untuk param order ID
export const orderParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid order ID'),
  }),
});

// Schema untuk delete order item
export const deleteOrderItemSchema = z.object({
  params: z.object({
    orderId: z.string().cuid('Invalid order ID'),
    itemId: z.string().cuid('Invalid item ID'),
  }),
});

// Schema untuk query get all transactions
export const getAllTransactionsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
    search: z.string().optional(),
    orderById: z.enum(['asc', 'desc']).optional(),
    orderByAmount: z.enum(['asc', 'desc']).optional(),
  }),
});

// Schema untuk get detail transaction
export const getDetailTransactionSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid transaction ID'),
  }),
});

export const getTransactionStatisticsSchema = z.object({
  query: z.object({}).optional(),
});

// Type exports
export type CreateOrderInput = z.infer<typeof createTransactionSchema>;
export type AddOrderItemInput = z.infer<typeof addOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
export type OrderParamInput = z.infer<typeof orderParamSchema>;
export type DeleteOrderItemInput = z.infer<typeof deleteOrderItemSchema>;
export type GetAllTransactionsInput = z.infer<typeof getAllTransactionsSchema>;
export type GetDetailTransactionInput = z.infer<typeof getDetailTransactionSchema>;
export type GetTransactionStatisticsInput = z.infer<typeof getTransactionStatisticsSchema>;
