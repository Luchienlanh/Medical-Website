import express from 'express';
import {
    createPurchaseInvoice,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    getPurchaseInvoiceById,
    getAllPurchaseInvoices
} from '../controllers/purchaseInvoiceController.js';

const router = express.Router();

router.post('/', createPurchaseInvoice);
router.put('/:id', updatePurchaseInvoice);
router.delete('/:id', deletePurchaseInvoice);
router.get('/:id', getPurchaseInvoiceById);
router.get('/', getAllPurchaseInvoices);

export default router;
