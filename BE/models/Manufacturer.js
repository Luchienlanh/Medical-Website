import mongoose from 'mongoose'

const manufacturerSchema = new mongoose.Schema({
    manufacturerId: {type: String, required: true, index: true, unique: true},
    manufacturerName: {type: String, required: true},
    adress: {type: String, required: true},
    phoneNum: {type: String, required: true}
}, {timestamps: true});

export const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema)