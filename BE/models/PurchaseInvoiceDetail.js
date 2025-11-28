import mongoose from 'mongoose'

const purchaseInvoiceDetailSchema = new mongoose.Schema({
    purchaseInvoiceId: {type: String, ref: 'PurchaseInvoice', required: true},
    productId: {type: String, ref: 'Product', required: true},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true},
    totalPrice: {type: Number, required: true}
}, {timestamps: true});

purchaseInvoiceDetailSchema.index(
    {purchaseInvoiceId: 1, productId: 1},
    {unique: true}
)

export const PurchaseInvoiceDetail = mongoose.model('PurchaseInvoiceDetail', purchaseInvoiceDetailSchema)