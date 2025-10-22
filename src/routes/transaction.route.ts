import { Router } from 'express';
import { createTransaction, getAllTransaction, getDetailTransaction, getTransactionStatistics} from '../controllers/transaction.controller';
import { validate } from '../middleware/validate.middleware';
import { createTransactionSchema, getAllTransactionsSchema, getDetailTransactionSchema, getTransactionStatisticsSchema } from '../schemas/transaction.schema';

const router = Router();

router.post('/', validate(createTransactionSchema), createTransaction);
router.get('/statistics', validate(getTransactionStatisticsSchema), getTransactionStatistics);
router.get('/:id', validate(getDetailTransactionSchema), getDetailTransaction);
router.get('/', validate(getAllTransactionsSchema), getAllTransaction);

export default router;