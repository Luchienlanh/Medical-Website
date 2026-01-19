import { OrderStatus } from '../models/saleInvoice/OrderStatus.js';
import { createOrderStatusValidator, updateOrderStatusValidator } from '../validators/saleInvoice/orderStatusValidator.js';
import dotenv from 'dotenv';
dotenv.config();

// Create Order Status
export const createOrderStatus = async (req, res, next) => {
    const { statusName } = req.body;
    try {
        const { value, error } = createOrderStatusValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        // Check if status already exists
        const existingStatus = await OrderStatus.findOne({ statusName });
        if (existingStatus) {
            return res.status(404).json({
                message: 'Trạng thái đơn hàng này đã tồn tại!'
            });
        }

        const newStatus = await OrderStatus.create({ statusName });

        return res.status(200).json({
            message: 'Tạo trạng thái đơn hàng thành công!',
            status: newStatus
        });
    } catch(error) {
        console.error('Lỗi khi tạo trạng thái đơn hàng:', error);
        return next(error);
    }
};

// Get All Order Statuses
export const getAllOrderStatuses = async (req, res, next) => {
    try {
        const statuses = await OrderStatus.find();

        return res.status(200).json({
            message: 'Lấy danh sách trạng thái đơn hàng thành công!',
            statuses
        });
    } catch(error) {
        console.error('Lỗi khi lấy danh sách trạng thái:', error);
        return next(error);
    }
};

// Get Order Status By ID
export const getOrderStatusById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const status = await OrderStatus.findById(id);

        if (!status) {
            return res.status(404).json({
                message: 'Không tìm thấy trạng thái đơn hàng!'
            });
        }

        return res.status(200).json({
            message: 'Lấy trạng thái đơn hàng thành công!',
            status
        });
    } catch(error) {
        console.error('Lỗi khi lấy trạng thái:', error);
        return next(error);
    }
};

// Update Order Status
export const updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const { statusName } = req.body;
    try {
        const { value, error } = updateOrderStatusValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        // Check if new status name already exists (excluding current one)
        const existingStatus = await OrderStatus.findOne({ statusName });
        if (existingStatus && existingStatus._id.toString() !== id) {
            return res.status(400).json({
                message: 'Trạng thái đơn hàng này đã tồn tại!'
            });
        }

        const updatedStatus = await OrderStatus.findByIdAndUpdate(
            id, 
            { statusName }, 
            { new: true }
        );

        if (!updatedStatus) {
            return res.status(404).json({
                message: 'Không tìm thấy trạng thái đơn hàng để cập nhật!'
            });
        }

        return res.status(200).json({
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            status: updatedStatus
        });
    } catch(error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        return next(error);
    }
};

// Delete Order Status
export const deleteOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedStatus = await OrderStatus.findByIdAndDelete(id);

        if (!deletedStatus) {
            return res.status(404).json({
                message: 'Không tìm thấy trạng thái đơn hàng để xóa!'
            });
        }

        return res.status(200).json({
            message: 'Xóa trạng thái đơn hàng thành công!',
            status: deletedStatus
        });
    } catch(error) {
        console.error('Lỗi khi xóa trạng thái:', error);
        return next(error);
    }
};
