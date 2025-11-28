import mongoose from 'mongoose'

const orderStatusSchema = new mongoose.Schema({
    statusId: {type: String, required: true, index: true, unique: true},
    statusName: {type: String, Enumerator: ['Pending', 'Processing', 'Completed', 'Cancelled'], required: true}
});

export const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema)