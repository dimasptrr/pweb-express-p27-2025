import { Router } from 'express';
import { createTransaction, getAllTransaction, getDetailTransaction, getTransactionStatistics} from '../controllers/transaction.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { createTransactionSchema, getAllTransactionsSchema, getDetailTransactionSchema, getTransactionStatisticsSchema } from '../schemas/transaction.schema';

const router = Router();

router.post('/', authMiddleware, validate(createTransactionSchema), createTransaction);
router.get('/statistics', authMiddleware, validate(getTransactionStatisticsSchema), getTransactionStatistics);
router.get('/:id', authMiddleware, validate(getDetailTransactionSchema), getDetailTransaction);
router.get('/', authMiddleware, validate(getAllTransactionsSchema), getAllTransaction);

export default router;