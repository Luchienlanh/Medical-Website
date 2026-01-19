import { Category } from '../models/product/Category.js';
import { APIFeatures, getPaginationMeta } from '../utils/apiFeatures.js';
import { createCategorySchema, updateCategorySchema } from '../validators/product/categoryValidator.js';

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
            return res.status(404).json({
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
            return res.status(404).json({
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

export const getAllCategories = async (req, res, next) => {
    try {
        const apiFeatures = new APIFeatures(Category.find(), req.query)
            .filter()
            .sort()
            .paginate();

        const categories = await apiFeatures.query;
        const countCategories = new APIFeatures(Category.find(), req.query)
            .filter()
            .search(['categoryName']);
        const totalCategories = await Category.countDocuments(countCategories.query.getFilter());

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pagination = getPaginationMeta(totalCategories, page, limit);

        return res.status(200).json({
            message: 'Lấy danh sách loại sản phẩm thành công!',
            categories,
            pagination
        });
    } catch(error) {
        console.error('Lỗi khi lấy danh sách loại sản phẩm:', error);
        return next(error);
    }
}
