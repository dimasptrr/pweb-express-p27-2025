import { Router } from 'express';
import { LibraryController } from '../controllers/library.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createBookSchema,
  getAllBooksSchema,
  getBooksByGenreSchema,
  bookParamSchema,
  updateBookSchema,
} from '../schemas/library.schema';

const router = Router();

// POST /books - Create new book (protected)
router.post(
  '/',
  authMiddleware,
  validate(createBookSchema),
  LibraryController.createBook
);

// GET /books - Get all books (protected)
router.get(
  '/',
  authMiddleware,
  validate(getAllBooksSchema),
  LibraryController.getAllBooks
);

// GET /books/genre/:id - Get books by genre (protected) - MUST BE BEFORE /:id
router.get(
  '/genre/:id',
  authMiddleware,
  validate(getBooksByGenreSchema),
  LibraryController.getBooksByGenre
);

// GET /books/:id - Get book detail (protected)
router.get(
  '/:id',
  authMiddleware,
  validate(bookParamSchema),
  LibraryController.getBookDetail
);

// PATCH /books/:id - Update book (protected)
router.patch(
  '/:id',
  authMiddleware,
  validate(updateBookSchema),
  LibraryController.updateBook
);

// DELETE /books/:id - Delete book (protected)
router.delete(
  '/:id',
  authMiddleware,
  validate(bookParamSchema),
  LibraryController.deleteBook
);

export default router;
