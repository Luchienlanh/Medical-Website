import mongoose from 'mongoose'

const stockTransactionSchema = new mongoose.Schema({
    batchId: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductBatch'},
    warehouseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse'},
    transactionType: {type: String, enum: ['IMPORT', 'EXPORT', 'ADJUST']},
    quantity: {type: Number, required: true},
    transactionDate: {type: Date, required: true, default: Date.now},
    relatedInvoiceId: {type: mongoose.Schema.Types.ObjectId}
}, {timestamps: true});

export const StockTransaction = mongoose.model('StockTransaction', stockTransactionSchema)