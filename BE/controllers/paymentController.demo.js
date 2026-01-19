import { Payment } from '../models/payment/Payment.js';
import { SaleInvoice } from '../models/saleInvoice/SaleInvoice.js';
import { createPaymentValidator } from '../validators/payment/paymentValidator.js';
import { PaymentFactory } from '../utils/paymentFactory.js';
import dotenv from 'dotenv';
dotenv.config();

// ==========================================
// CREATE PAYMENT (Multi-Gateway Support)
// ==========================================
export const createPayment = async (req, res, next) => {
    const { saleInvoiceId, amount, paymentMethod, returnUrl } = req.body;

    try {
        // BƯỚC 1: Validate
        const { error } = createPaymentValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        // BƯỚC 2: Kiểm tra Invoice
        const invoice = await SaleInvoice.findById(saleInvoiceId);
        if (!invoice) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn!'
            });
        }

        // BƯỚC 3: Check đã thanh toán chưa
        const existingPayment = await Payment.findOne({
            saleInvoiceId,
            paymentStatus: 'Success'
        });
        if (existingPayment) {
            return res.status(400).json({
                message: 'Hóa đơn này đã được thanh toán!'
            });
        }

        // BƯỚC 4: Tạo Payment record
        const payment = await Payment.create({
            saleInvoiceId,
            amount,
            paymentMethod,
            paymentStatus: 'Pending'
        });

        // BƯỚC 5: Gateway routing với Factory
        if (PaymentFactory.isSupported(paymentMethod)) {
            try {
                // Get adapter
                const adapter = PaymentFactory.getAdapter(paymentMethod);
                
                // Build payment URL
                const paymentUrl = await adapter.buildPaymentUrl({
                    orderId: payment._id.toString(),
                    amount: payment.amount,
                    orderInfo: `Thanh toan hoa don ${saleInvoiceId}`,
                    returnUrl: returnUrl,
                    ipAddr: req.ip || '127.0.0.1'
                });

                return res.status(200).json({
                    message: `Tạo thanh toán ${paymentMethod} thành công!`,
                    payment: {
                        _id: payment._id,
                        amount: payment.amount,
                        status: payment.paymentStatus,
                        method: payment.paymentMethod
                    },
                    paymentUrl
                });
            } catch (gatewayError) {
                // Nếu gateway error → delete payment record
                await Payment.findByIdAndDelete(payment._id);
                
                return res.status(500).json({
                    message: `Lỗi kết nối ${paymentMethod}: ${gatewayError.message}`
                });
            }
        }

        // BƯỚC 6: Cash payment
        return res.status(200).json({
            message: 'Tạo thanh toán tiền mặt thành công!',
            payment
        });

    } catch(error) {
        console.error('Lỗi tạo thanh toán:', error);
        return next(error);
    }
};

// ==========================================
// VNPAY CALLBACK
// ==========================================
export const vnpayReturn = async (req, res, next) => {
    try {
        const VNPayAdapter = PaymentFactory.getAdapter('VNPAY');
        
        // Verify hash
        const isValid = VNPayAdapter.verifyCallback({...req.query});
        if (!isValid) {
            return res.status(400).json({
                message: 'Chữ ký không hợp lệ!'
            });
        }

        // Parse response
        const paymentData = VNPayAdapter.parseResponse(req.query);
        
        // Update payment
        const payment = await Payment.findById(paymentData.orderId);
        if (!payment) {
            return res.status(404).json({
                message: 'Không tìm thấy thanh toán!'
            });
        }

        if (payment.paymentStatus !== 'Pending') {
            return res.json({ message: 'Đã xử lý', payment });
        }

        // Update
        const isSuccess = paymentData.responseCode === VNPayAdapter.getSuccessCode();
        payment.paymentStatus = isSuccess ? 'Success' : 'Failed';
        payment.gatewayTransactionNo = paymentData.transactionNo;
        payment.gatewayBankCode = paymentData.bankCode;
        payment.gatewayCardType = paymentData.cardType;
        payment.gatewayOrderInfo = paymentData.orderInfo;
        payment.gatewayResponseCode = paymentData.responseCode;
        payment.paidDate = isSuccess ? new Date() : null;
        payment.callbackData = req.query;
        await payment.save();

        // Update invoice
        if (isSuccess) {
            await SaleInvoice.findByIdAndUpdate(payment.saleInvoiceId, {
                paymentStatus: 'Paid'
            });
        }

        return res.json({
            success: isSuccess,
            message: VNPayAdapter.getErrorMessage(paymentData.responseCode),
            payment
        });

    } catch(error) {
        console.error('Lỗi VNPay callback:', error);
        return next(error);
    }
};

// ==========================================
// MOMO CALLBACK
// ==========================================
export const momoReturn = async (req, res, next) => {
    try {
        const MomoAdapter = PaymentFactory.getAdapter('Momo');
        
        // Verify
        const isValid = MomoAdapter.verifyCallback(req.body);
        if (!isValid) {
            return res.status(400).json({
                message: 'Chữ ký không hợp lệ!'
            });
        }

        // Parse
        const paymentData = MomoAdapter.parseResponse(req.body);
        
        // Update payment (tương tự VNPay)
        const payment = await Payment.findById(paymentData.orderId);
        if (!payment || payment.paymentStatus !== 'Pending') {
            return res.json({ message: 'Đã xử lý' });
        }

        const isSuccess = paymentData.responseCode === MomoAdapter.getSuccessCode();
        payment.paymentStatus = isSuccess ? 'Success' : 'Failed';
        payment.gatewayTransactionNo = paymentData.transactionNo;
        payment.gatewayBankCode = paymentData.bankCode;
        payment.gatewayResponseCode = paymentData.responseCode;
        payment.paidDate = isSuccess ? new Date() : null;
        payment.callbackData = req.body;
        await payment.save();

        if (isSuccess) {
            await SaleInvoice.findByIdAndUpdate(payment.saleInvoiceId, {
                paymentStatus: 'Paid'
            });
        }

        return res.json({
            success: isSuccess,
            message: MomoAdapter.getErrorMessage(paymentData.responseCode)
        });

    } catch(error) {
        console.error('Lỗi Momo callback:', error);
        return next(error);
    }
};

// ==========================================
// ZALOPAY CALLBACK
// ==========================================
export const zalopayCallback = async (req, res, next) => {
    try {
        const ZaloPayAdapter = PaymentFactory.getAdapter('ZaloPay');
        
        // Verify
        const isValid = ZaloPayAdapter.verifyCallback(req.body);
        if (!isValid) {
            return res.json({ return_code: -1, return_message: 'Invalid MAC' });
        }

        // Parse
        const paymentData = ZaloPayAdapter.parseResponse(req.body);
        
        // Update payment
        const payment = await Payment.findById(paymentData.orderId);
        if (!payment || payment.paymentStatus !== 'Pending') {
            return res.json({ return_code: 2, return_message: 'Already processed' });
        }

        const isSuccess = paymentData.responseCode === ZaloPayAdapter.getSuccessCode();
        payment.paymentStatus = isSuccess ? 'Success' : 'Failed';
        payment.gatewayTransactionNo = paymentData.transactionNo;
        payment.gatewayResponseCode = paymentData.responseCode;
        payment.paidDate = isSuccess ? new Date() : null;
        payment.callbackData = req.body;
        await payment.save();

        if (isSuccess) {
            await SaleInvoice.findByIdAndUpdate(payment.saleInvoiceId, {
                paymentStatus: 'Paid'
            });
        }

        // ZaloPay yêu cầu return code
        return res.json({
            return_code: 1,
            return_message: 'success'
        });

    } catch(error) {
        console.error('Lỗi ZaloPay callback:', error);
        return res.json({ return_code: 0, return_message: 'Error' });
    }
};

// ==========================================
// GET PAYMENT BY INVOICE
// ==========================================
export const getPaymentByInvoice = async (req, res, next) => {
    const { invoiceId } = req.params;

    try {
        const payment = await Payment.findOne({ saleInvoiceId: invoiceId })
            .populate('saleInvoiceId');

        if (!payment) {
            return res.status(404).json({
                message: 'Không tìm thấy thông tin thanh toán!'
            });
        }

        return res.json({
            message: 'Lấy thông tin thanh toán thành công!',
            payment
        });

    } catch(error) {
        return next(error);
    }
};

// ==========================================
// GET ALL PAYMENTS
// ==========================================
export const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('saleInvoiceId')
            .sort('-createdAt');

        return res.json({
            message: 'Lấy danh sách thanh toán thành công!',
            payments
        });

    } catch(error) {
        return next(error);
    }
};
