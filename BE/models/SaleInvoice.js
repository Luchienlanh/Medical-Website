import mongoose from 'mongoose'

const saleInvoiceSchema = new mongoose.Schema({
    saleInvoiceId: {type: String, required: true, index: true, unique: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    saleDate: {type: Date, required: true},
    statusId: {type: String, ref: 'OrderStatus', required: true}
}, {timestamps: true});

export const SaleInvoice = mongoose.model('SaleInvoice', saleInvoiceSchema)