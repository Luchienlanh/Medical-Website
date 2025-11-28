import mongoose from 'mongoose'

const purchaseInvoiceSchema = new mongoose.Schema({
    purchaseInvoiceId: {type: String, required: true, index: true, unique: true},
    manufacturerId: {type: String, ref: 'Manufacturer', required: true},
    dateImport: {type: Date, required: true},
    totalBill: {type: Number}
}, {timestamps: true});

export const PurchaseInvoice = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema)