import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    paymentId: {type: String, required: true, index: true, unique: true},
    saleInvoiceId: {type: String, ref: 'SaleInvoice', required: true},
    transactionId: {type: String, ref: 'StockTransaction', required: true},
    paymentMethod: {type: String, Enumerator: ['Momo', 'ZaloPay', 'VNPAY']},
    amount: {type: Number, required: true},
    paymentStatus: {type: String, Enumerator: ['Pending', 'Success', 'Failed', 'Refunded']},
    paymentDate: {type: Date, required: true}
}, {timestamps: true});

export const Payment = mongoose.model('Payment', paymentSchema)