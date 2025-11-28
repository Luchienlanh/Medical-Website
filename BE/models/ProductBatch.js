import mongoose from 'mongoose'

const productBatchSchema = new mongoose.Schema({
    batchId: {type: String, required: true, index: true, unique: true},
    productId: {type: String, ref: 'Product', required: true},
    purchaseInvoiceId: {type: String, ref: 'PurchaseInvoice', required: true},
    manufactureDate: {type: Date, required: true}, 
    expiryDate: {type: Date, required: true},
    quantity: {type: Number},
    remainingQuantity: {type: Number},
    dosage: {type: String, required: true},
    administration: {type: String, required: true}
}, {timestamps: true});

export const ProductBatch = mongoose.model('ProductBatch', productBatchSchema)