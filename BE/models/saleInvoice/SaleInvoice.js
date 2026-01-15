import mongoose from 'mongoose'

const saleInvoiceSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    saleDate: {type: Date, required: true, default: Date.now},
    statusId: {type: mongoose.Schema.Types.ObjectId, ref: 'OrderStatus'}
}, {timestamps: true});

export const SaleInvoice = mongoose.model('SaleInvoice', saleInvoiceSchema)