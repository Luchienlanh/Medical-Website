import { productSchema } from "../models/product/Product"
import { createProductSchema, updateProductSchema } from "../validators/product/productValidator";
import dotenv from "dotenv"
dotenv.config();

export const createProduct = async (req, res, next) => {

    const { productName, img, productDes, packagingType, status } = req.body;
    try {
        const { value, error } = createProductSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const existingProduct = await productSchema.findOne({ productName, packagingType });
        if (existingProduct) {
            return res.status(400).json({
                message: 'Sản phẩm với tên và loại bao bì này đã tồn tại!'
            });
        }
        const newProduct = new productSchema({
            productName,
            img,
            productDes,
            packagingType,
            status
        });
        await newProduct.save();

        return res.status(200).json({
            message: 'Tạo sản phẩm thành công!',
            product: {
                productName: newProduct.productName,
                packagingType: newProduct.packagingType
            }
        });
    } catch(error) {
        console.error("Lỗi tạo sản phẩm:", error);
        return next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { productName, img, productDes, packagingType, status } = req.body;
    try {
        const { value, error } = updateProductSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const existingProduct = await productSchema.findOne({ productName, packagingType });
        if (existingProduct && existingProduct._id.toString() !== id) {
            return res.status(400).json({
                message: 'Sản phẩm với tên và loại bao bì này đã tồn tại!'
            });
        }
        const updatedProduct = await productSchema.findByIdAndUpdate(id, {
            productName,
            img,
            productDes,
            packagingType,
            status
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm để cập nhật!'
            });
        }

        return res.status(200).json({
            message: 'Cập nhật sản phẩm thành công!',
            product: updatedProduct
        });
    } catch(error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        return next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteProd = await productSchema.findByIdAndDelete(id);
        if (!deleteProd) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm để xóa!'
            });
        }
        return res.status(200).json({
            message: 'Xóa sản phẩm thành công!',
            product
        });
    } catch(error) {
        console.error("Lỗi xóa sản phẩm:", error);
        return next(error);
    }
}

export const getProductById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const products = await productSchema.findById(id);
        if (!products) {
            return res.status(400).json({
                message: 'Không tìm thấy sản phẩm!'
            });
        }
        return res.status(200).json({
            messages: 'Lấy sản phẩm thành công!',
            products
        });
    } catch(error) {
        console.error("Lỗi lấy sản phẩm:", error);
        return next(error);
    }
}

export const getProductByName = async (req, res, next) => {
    const { productName } = req.params;
    try {
        const products = await productSchema.find({ 
            productName: { $regex: productName, $options: 'i' }
        });
        if (!products) {
            return res.status(400).json({
                messages: 'Không tìm thấy sản phẩm!'
            });
        }
        return res.status(200).json({
            messages: 'Lấy sản phẩm thành công!',
            products
        });
    } catch(error) {
        console.error("Lỗi lấy sản phẩm:", error);
        return next(error);
    }
}

export const getAllProduct = async (req, res, next) => {
    
}