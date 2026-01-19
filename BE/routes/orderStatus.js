import express from 'express';
import {
    createOrderStatus,
    getAllOrderStatuses,
    getOrderStatusById,
    updateOrderStatus,
    deleteOrderStatus
} from '../controllers/orderStatusController.js';

const router = express.Router();

router.post('/', createOrderStatus);
router.get('/', getAllOrderStatuses);
router.get('/:id', getOrderStatusById);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrderStatus);

export default router;
