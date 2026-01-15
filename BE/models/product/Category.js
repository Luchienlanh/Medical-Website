import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    categoryName: {type: String, required: true},
    description: {type: String}
}, {timestamps: true});

export const Category = mongoose.model('Category', categorySchema)