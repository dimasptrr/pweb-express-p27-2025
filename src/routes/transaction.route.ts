import { Router } from 'express';
import { createTransaction, getAllTransaction, getDetailTransaction, getTransactionStatistics} from '../controllers/transaction.controller';
import { get } from 'http';

const router = Router();

router.post('/', createTransaction);
router.get('/', getAllTransaction);
router.get('/:id', getDetailTransaction);
router.get('/statistics', getTransactionStatistics);

export default router;