import { Warehouse } from '../models/warehouse/Warehouse.js';
import { APIFeatures, getPaginationMeta } from "../utils/apiFeatures.js";
import { createWarehouseSchema, updateWarehouseSchema } from '../validators/warehouse/warehouseValidator.js';
import dotenv from 'dotenv';
dotenv.config();    


export const createWarehouse = async (req, res, next) => {
    const { warehouseName, address, status } = req.body;
    try {
        const { value, error } = createWarehouseSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const existingWarehouse = await Warehouse.findOne({ warehouseName, address });
        if (existingWarehouse) {
            return res.status(400).json({
                message: 'Nhà kho với tên và địa chỉ này đã tồn tại!'
            });
        }
        const newWarehouse = new Warehouse({
            warehouseName, 
            address, 
            status  
        });
        await newWarehouse.save();

        return res.status(200).json({
            message: 'Tạo nhà kho thành công!',
        });
    } catch(error) {
        console.error('Lỗi khi tạo nhà kho:', error);
        return next(error);
    }
}

export const updateWarehouse = async (req, res, next) => {
    const { id } = req.params;
    const { warehouseName, address, status } = req.body;
    try {
        const { value, error } = updateWarehouseSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const existingWarehouse = await Warehouse.findOne({ warehouseName, address });
        if (existingWarehouse && existingWarehouse._id.toString() !== id) {
            return res.status(400).json({
                message: 'Nhà kho với tên và địa chỉ này đã tồn tại!'
            });
        }
        const updateWarehouse = await Warehouse.findByIdAndUpdate( id, {
            warehouseName,
            address,
            status
        }, { new: true });
        
        return res.status(200).json({
            message: 'Cập nhật nhà kho thành công!',
        });
    } catch(error) {
        console.error('Lỗi khi cập nhật nhà kho:', error);
        return next(error);
    }
}

export const deleteWarehouse = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteWarehouse = await Warehouse.findByIdAndDelete(id);
        if (!deleteWarehouse) {
            return res.status(404).json({
                message: 'Không tìm thấy nhà kho để xóa!'
            });
        }

        return res.status(200).json({
            message: 'Xóa nhà kho thành công!'
        });
    } catch(error) {
        console.error('Lỗi khi xóa nhà kho:', error);
        return next(error);
    }
}

export const getAllWarehouses = async (req, res, next) => {
    try {
        const apiFeatures = new APIFeatures(Warehouse.find(), req.query)
            .filter()
            .search(['warehouseName', 'address'])
            .sort()
            .paginate();
        const warehouses = await apiFeatures.query;
        const countWarehouses = new APIFeatures(Warehouse.find(), req.query)
            .filter()
            .search(['warehouseName', 'address']);
        const totalWarehouses = await Warehouse.countDocuments(countWarehouses.query.getFilter());

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pagination = getPaginationMeta(totalWarehouses, page, limit);

        return res.status(200).json({
            message: 'Lấy danh sách nhà kho thành công!',
            warehouses,
            pagination
        });
    } catch(error) {
        console.error('Lỗi khi lấy danh sách nhà kho:', error);
        return next(error);
    }
}
