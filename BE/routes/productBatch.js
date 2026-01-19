import express from 'express';
import {
    createProductBatch,
    updateProductBatch,
    deleteProductBatch,
    getAllProductBatches
} from '../controllers/productBatchController.js';

const router = express.Router();

router.post('/', createProductBatch);
router.put('/:id', updateProductBatch);
router.delete('/:id', deleteProductBatch);
router.get('/', getAllProductBatches);

export default router;
