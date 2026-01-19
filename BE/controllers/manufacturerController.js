import { Manufacturer } from "../models/manufacturer/Manufacturer.js"
import { createManufacturerSchema, updateManufacturerSchema } from "../validators/manufacturer/manufacturerValidator.js";
import { APIFeatures, getPaginationMeta } from "../utils/apiFeatures.js"
import dotenv from "dotenv"
dotenv.config();

export const createManufacturer = async (req, res, next) => {
    const { manufacturerName, address, phoneNum } = req.body;
    try {
        const { value, error } = createManufacturerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const existingManuf = await Manufacturer.findOne({ manufacturerName, address });
        if (existingManuf) {
            return res.status(400).json({
                message: 'Nhà sản xuất ở chi nhánh này đã tồn tại!'
            });
        }
        const newManuf = new Manufacturer({
            manufacturerName: manufacturerName,
            address,
            phoneNum
        });
        await newManuf.save();
        
        return res.status(200).json({
            message: 'Tạo nhà sản xuất thành công!',
        });
    } catch(error) {
        console.error("Lỗi tạo nhà sản xuất:", error);
        return next(error);
    }
}

export const updatedManufacturer = async (req, res, next) => {
    const { id } = req.params;
    const { manufacturerName, address, phoneNum } = req.body;
    try {
        const { value, error } = updateManufacturerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const existingManuf = await Manufacturer.findOne({ manufacturerName, address });
        if (existingManuf && existingManuf._id.toString() !== id) {
            return res.status(400).json({
                message: 'Nhà sản xuất ở chi nhánh này đã tồn tại!'
            });
        }
        const updateManuf = await Manufacturer.findByIdAndUpdate(id, {
            manufacturerName: manufacturerName,
            address,
            phoneNum
        }, { new: true });

        if (!updateManuf) {
            return res.status(404).json({
                message: 'Không tìm thấy nhà sản xuất!'
            });
        }
        return res.status(200).json({
            message: 'Cập nhật nhà sản xuất thành công!',
        });
    } catch(error) {
        console.error("Lỗi cập nhật nhà sản xuất:", error);
        return next(error);
    }
}

export const deleteManufacturer = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteManuf = await Manufacturer.findByIdAndDelete(id);
        if (!deleteManuf) {
            return res.status(404).json({
                message: 'Không tìm thấy nhà sản xuất để xóa!'
            });
        }
        return res.status(200).json({
            message: 'Xóa nhà sản xuất thành công!',
        });
    } catch(error) {
        console.error("Lỗi xóa nhà sản xuất:", error);
        return next(error);
    }
}

export const getAllManufacturers = async (req, res, next) => {
    try { 
        const apiFeatures = new APIFeatures(Manufacturer.find(), req.query)
            .filter()
            .search(['manufacturerName', 'address'])
            .sort()
            .paginate();
        const manufacturers = await apiFeatures.query;

        const countManufacturer = new APIFeatures(Manufacturer.find(), req.query)
            .filter()
            .search(['manufacturerName', 'address']);
        const totalManuf = await Manufacturer.countDocuments(countManufacturer.query.getFilter());

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pagination = getPaginationMeta(totalManuf, page, limit);
        
        return res.status(200).json({
            message: 'Lấy danh sách nhà sản xuất thành công!',
            manufacturers,
            pagination
        });
    } catch(error) {
        console.error("Lỗi lấy danh sách nhà sản xuất:", error);
        return next(error);
    }
}
