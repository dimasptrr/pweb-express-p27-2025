# Zod Validation & Response Formatter - Usage Guide

## 📁 Struktur File

```
src/
├── schemas/                      # Zod validation schemas
│   ├── auth.schema.ts
│   ├── genre.schema.ts
│   ├── library.schema.ts
│   └── transaction.schema.ts
├── middleware/
│   └── validate.middleware.ts   # Validation middleware
└── utils/
    └── response.util.ts         # Response formatter utility
```

## 🎯 Cara Penggunaan

### 1. Definisikan Schema (di folder `schemas/`)

```typescript
// src/schemas/transaction.schema.ts
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

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
```

### 2. Gunakan di Route

```typescript
// src/routes/transaction.route.ts
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validate } from '../middleware/validate.middleware';
import { createTransactionSchema, transactionParamSchema } from '../schemas/transaction.schema';

const router = Router();

// Dengan validasi
router.post('/', validate(createTransactionSchema), TransactionController.create);
router.get('/:id', validate(transactionParamSchema), TransactionController.getById);

export default router;
```

### 3. Gunakan di Controller dengan Response Formatter

```typescript
// src/controllers/transaction.controller.ts
import { Request, Response } from 'express';
import { ResponseFormatter } from '../utils/response.util';
import prisma from '../lib/prisma';

export const TransactionController = {
  create: async (req: Request, res: Response) => {
    try {
      const { user_id, items } = req.body;

      // Validasi user
      const user = await prisma.user.findUnique({ where: { id: user_id } });
      if (!user) {
        return ResponseFormatter.notFound(res, 'User not found');
      }

      // Create transaction
      const transaction = await prisma.order.create({
        data: { /* ... */ },
      });

      return ResponseFormatter.created(res, 'Transaction created successfully', transaction);
    } catch (error) {
      return ResponseFormatter.error(res, 'Failed to create transaction');
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const transaction = await prisma.order.findUnique({ where: { id } });
      
      if (!transaction) {
        return ResponseFormatter.notFound(res, 'Transaction not found');
      }

      return ResponseFormatter.success(res, 'Transaction retrieved successfully', transaction);
    } catch (error) {
      return ResponseFormatter.error(res, 'Failed to retrieve transaction');
    }
  },
};
```

## 📦 Response Format

### Success Response (200, 201)
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "...",
    "userId": "...",
    "items": [...]
  }
}
```

### Error Response (400, 404, 500)
```json
{
  "success": false,
  "message": "User not found",
  "data": undefined
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": [
    {
      "path": "body.user_id",
      "message": "Invalid user ID"
    },
    {
      "path": "body.items",
      "message": "At least one item is required"
    }
  ]
}
```

## 🛠️ Available Response Methods

```typescript
// Success responses
ResponseFormatter.success(res, message, data, statusCode?)      // 200
ResponseFormatter.created(res, message, data)                    // 201

// Error responses
ResponseFormatter.error(res, message, errors?, statusCode?)     // 500
ResponseFormatter.badRequest(res, message, errors?)             // 400
ResponseFormatter.unauthorized(res, message?)                   // 401
ResponseFormatter.forbidden(res, message?)                      // 403
ResponseFormatter.notFound(res, message?)                       // 404
```

## 🎨 Contoh Lengkap

### Auth Controller
```typescript
import { Request, Response } from 'express';
import { ResponseFormatter } from '../utils/response.util';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      
      // Check existing user
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return ResponseFormatter.badRequest(res, 'Email already registered');
      }

      // Create user
      const user = await prisma.user.create({ data: { username, email, password } });

      return ResponseFormatter.created(res, 'User registered successfully', {
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      return ResponseFormatter.error(res, 'Registration failed');
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return ResponseFormatter.unauthorized(res, 'Invalid credentials');
      }

      // Verify password (add bcrypt later)
      if (user.password !== password) {
        return ResponseFormatter.unauthorized(res, 'Invalid credentials');
      }

      return ResponseFormatter.success(res, 'Login successful', {
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      return ResponseFormatter.error(res, 'Login failed');
    }
  },
};
```

### Auth Route
```typescript
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
```

## ✅ Keuntungan

1. **Type Safety** - Schema Zod memberikan type inference otomatis
2. **Validasi Otomatis** - Request divalidasi sebelum masuk controller
3. **Consistent Response** - Format response yang konsisten di seluruh API
4. **Error Handling** - Error handling yang terstruktur
5. **Clean Code** - Controller lebih bersih dan fokus pada business logic

## 📝 Tips

1. Buat schema untuk setiap endpoint yang perlu validasi
2. Gunakan `ResponseFormatter` di semua controller untuk konsistensi
3. Tambahkan schema baru di folder `schemas/` sesuai kebutuhan
4. Kombinasikan dengan `authMiddleware` untuk protected routes

```typescript
// Protected route dengan validasi
router.post(
  '/transaction',
  authMiddleware,                      // Check authentication first
  validate(createTransactionSchema),   // Then validate input
  TransactionController.create         // Finally execute controller
);
```
