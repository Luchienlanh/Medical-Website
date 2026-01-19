import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    saleInvoiceId: {type: mongoose.Schema.Types.ObjectId, ref: 'SaleInvoice', required: true},
    amount: {type: Number, required: true, min: 1000},  // VNPay minimum 1000 VNĐ
    paymentMethod: {type: String, enum: ['Momo', 'ZaloPay', 'VNPAY', 'Cash'], required: true},
    paymentStatus: {type: String, enum: ['Pending', 'Success', 'Failed', 'Refunded'], default: 'Pending'},      
    
    gatewayTransactionNo: {type: String},
    gatewayBankCode: {type: String},
    gatewayResponseCode: {type: String},
    paidDate: {type: Date},
    callbackData: {type: Object}
}, {timestamps: true});

export const Payment = mongoose.model('Payment', paymentSchema)