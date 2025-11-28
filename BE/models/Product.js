import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, index: true, unique: true },
    productName: { type: String, required: true },
    manufacturerId: { type: String, ref: 'Manufacturer', required: true },
    typeId: { type: String, ref: 'Category', required: true },
    img: { type: Image, required: true },
    productDesc: { type: String, required: true },
    packagingType: { type: String, Enumerator: ['Blister', 'Box', 'Bottle', 'Tube', 'Sachet', 'Ampoule', 'Vial', 'Bag'], required: true },
    status: { type: Boolean }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema)