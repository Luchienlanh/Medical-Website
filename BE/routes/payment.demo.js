import express from 'express';
import { 
    createPayment,
    vnpayReturn,
    momoReturn,
    zalopayCallback,
    getPaymentByInvoice,
    getAllPayments
} from '../controllers/paymentController.js';

const router = express.Router();

// ========== PAYMENT CREATION ==========
router.post('/', createPayment);

// ========== VNPAY ENDPOINTS ==========
router.get('/vnpay-return', vnpayReturn);
router.get('/vnpay-ipn', vnpayReturn);  // Dùng chung với return

// ========== MOMO ENDPOINTS ==========
router.post('/momo-return', momoReturn);
router.post('/momo-ipn', momoReturn);  // Dùng chung

// ========== ZALOPAY ENDPOINTS ==========
router.post('/zalopay-callback', zalopayCallback);

// ========== QUERY ENDPOINTS ==========
router.get('/invoice/:invoiceId', getPaymentByInvoice);
router.get('/', getAllPayments);

export default router;
