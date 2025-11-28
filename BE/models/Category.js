import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    typeId: {type: String, required: true, index: true, unique: true},
    typeName: {type: String, required: true}
}, {timestamps: true});

export const Category = mongoose.model('Category', categorySchema)