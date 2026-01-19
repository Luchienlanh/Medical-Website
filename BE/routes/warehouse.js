import express from 'express';
import {
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getAllWarehouses
} from '../controllers/warehouseController.js';

const router = express.Router();

router.post('/', createWarehouse);
router.put('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);
router.get('/', getAllWarehouses);

export default router;
