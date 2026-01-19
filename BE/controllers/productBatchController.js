import { createProductBatchSchema, updateProductBatchSchema } from '../validators/product/productBatchValidator.js';
import { ProductBatch } from '../models/product/ProductBatch.js';  
import { APIFeatures, getPaginationMeta } from "../utils/apiFeatures.js"; 
import dotenv from 'dotenv';
dotenv.config();

export const createProductBatch = async (req, res, next) => {
    const { manufactureDate, expiryDate, quantity, dosage, administration } = req.body; 
    try {
        const { value, error } = createProductBatchSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const newProductBatch = new ProductBatch({
            manufactureDate,
            expiryDate,
            quantity,
            dosage,
            administration
        });
        await newProductBatch.save();
        
        return res.status(200).json({
            message: 'Tạo lô sản phẩm thành công!',
        });
    } catch(error) {
        console.error("Lỗi tạo lô sản phẩm:", error);
        return next(error);
    }
}

export const updateProductBatch = async (req, res, next) => {
    const { id } = req.params;
    const { manufactureDate, expiryDate, quantity, dosage, administration } = req.body;
    try {
        const { value, error } = updateProductBatchSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const updateProductBatch = await ProductBatch.findByIdAndUpdate(id, {
            manufactureDate,
            expiryDate,
            quantity,
            dosage,
            administration
        }, { new: true });
        if (!updateProductBatch) {
            return res.status(404).json({
                message: 'Lô sản phẩm không tồn tại!'
            });
        }

        return res.status(200).json({
            message: 'Cập nhật lô sản phẩm thành công!',
        });
    } catch(error) {
        console.error("Lỗi cập nhật lô sản phẩm:", error);
        return next(error);
    }
}

export const deleteProductBatch = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteProductBatch = await ProductBatch.findByIdAndDelete(id);
        if (!deleteProductBatch) {
            return res.status(404).json({
                message: 'Lô sản phẩm không tồn tại!'
            });
        }

        return res.status(200).json({
            message: 'Xóa lô sản phẩm thành công!',
        });
    } catch(error) {
        console.error("Lỗi xóa lô sản phẩm:", error);
        return next(error);
    }
}

export const getAllProductBatches = async (req, res, next) => {
    try {
        if (!req.query.sort) {
            req.query.sort = 'expiryDate';
        }
        const apiFeatures = new APIFeatures(ProductBatch.find(), req.query)
            .filter()
            .sort()
            .paginate();
        const productBatches = await apiFeatures.query
            .populate('productId')
            .populate('purchaseInvoiceId');
            
        const countProductBatch = new APIFeatures(ProductBatch.find(), req.query)
            .filter()
            .search(['expiryDate', 'quantity', 'dosage', 'administration']);

        const totalProductBatch = await ProductBatch.countDocuments(countProductBatch.query.getFilter());

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pagination = getPaginationMeta(totalProductBatch, page, limit);

        return res.status(200).json({
            message: 'Lấy danh sách lô sản phẩm thành công!',
            productBatches,
            pagination
        });
    } catch(error) {
        console.error("Lỗi lấy danh sách lô sản phẩm:", error);
        return next(error);
    }
}

