import { Category } from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

export const createCategory = async (req, res, next) => {
    const { categoryName, description } = req.body;
    try {
        const { value, error } = createCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const newCategory = new Category({
            categoryName,
            description
        });
        await newCategory.save();

        return res.status(200).json({
            message: 'Tạo loại sản phẩm thành công!',
        });
    } catch(error) {
        console.error("Lỗi tạo loại sản phẩm:", error);
        return next(error);
    }
}

export const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { categoryName, description } = req.body;
    try {
        const { value, error } = updateCategorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const updateCategory = await Category.findByIdAndUpdate( id, {
            categoryName,
            description
        }, { new: true });
        if (!updateCategory) {
            return res.status(400).json({
                message: "Loại sản phẩm không tồn tại!"
            });
        }

        return res.status(200).json({
            message: "Cập nhật loại sản phẩm thành công!"
        });
    } catch(error) {
        console.error("Lỗi cập nhật loại sản phẩm!", error);
        return next(error);
    }
}

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        if (!deleteCategory) {
            return res.status(400).json({
                message: "Loại sản phẩm không tồn tại!"
            });
        }

        return res.status(200).json({
            message: "Xóa loại sản phẩm thành công!"
        });
    } catch(error) {
        console.error("Lỗi xóa loại sản phẩm!", error);
        return next(error);
    }
}