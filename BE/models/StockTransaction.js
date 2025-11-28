import mongoose from 'mongoose'

const stockTransactionSchema = new mongoose.Schema({
    transactionId: {type: String, required: true, index: true, unique: true},
    batchId: {type: String, ref: 'ProductBatch', required: true},
    warehouseId: {type: String, ref: 'Warehouse', required: true},
    transactionType: {type: String, Enumerator: ['IMPORT', 'EXPORT', 'ADJUST'], required: true},
    quantity: {type: Number, required: true},
    transactionDate: {type: Date, required: true},
    relatedInvoiceId: {type: String}
}, {timestamps: true});

export const StockTransaction = mongoose.model('StockTransaction', stockTransactionSchema)