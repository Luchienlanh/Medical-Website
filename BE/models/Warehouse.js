import mongoose from 'mongoose'

const warehouseSchema = new mongoose.Schema({
    warehouseId: {type: String, required: true, index: true, unique: true},
    warehouseName: {type: String},
    status: {type: Boolean}
}, {timestamps: true});

export const Warehouse = mongoose.model('Warehouse', warehouseSchema)