import express from 'express';
import {
    createSaleInvoice,
    updateSaleInvoice,
    deleteSaleInvoice,
    getSaleInvoiceById,
    getAllSaleInvoices
} from '../controllers/saleInvoiceController.js';

const router = express.Router();

router.post('/', createSaleInvoice);
router.put('/:id', updateSaleInvoice);
router.delete('/:id', deleteSaleInvoice);
router.get('/:id', getSaleInvoiceById);
router.get('/', getAllSaleInvoices);

export default router;
