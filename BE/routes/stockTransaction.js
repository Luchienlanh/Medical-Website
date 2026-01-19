import express from 'express';
import {
    createStockTransaction,
    getAllStockTransactions,
    getStockTransactionById,
    getTransactionsByBatch,
    updateStockTransaction,
    deleteStockTransaction,
    getStockSummaryByWarehouse
} from '../controllers/stockTransactionController.js';

const router = express.Router();

router.post('/', createStockTransaction);
router.get('/', getAllStockTransactions);
router.get('/:id', getStockTransactionById);
router.get('/batch/:batchId', getTransactionsByBatch);
router.get('/summary/warehouse/:warehouseId', getStockSummaryByWarehouse);
router.put('/:id', updateStockTransaction);
router.delete('/:id', deleteStockTransaction);

export default router;
