import { SaleInvoice } from '../models/saleInvoice/SaleInvoice.js';
import { SaleInvoiceDetail } from '../models/saleInvoice/SaleInvoiceDetail.js';
import { createSaleInvoiceValidator, updateSaleInvoiceValidator } from '../validators/saleInvoice/saleInvoiceValidator.js';
import { APIFeatures, getPaginationMeta } from '../utils/apiFeatures.js';
import dotenv from 'dotenv';
dotenv.config();

// Create Sale Invoice
export const createSaleInvoice = async (req, res, next) => {
    const { userId, saleDate, details } = req.body;
    try {
        const { value, error } = createSaleInvoiceValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const saleInvoice = await SaleInvoice.create({
            userId,
            saleDate,
            // details
        });
        const detailInvoice = details.map(d => ({
            saleInvoiceId: saleInvoice._id,
            batchId: d.batchId,
            productId: d.productId,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            totalPrice: d.unitPrice * d.quantity
        }));
        const createdDetails = await SaleInvoiceDetail.insertMany(detailInvoice);
        const totalBill = createdDetails.reduce((sum, d) => sum + d.totalPrice, 0);
        saleInvoice.totalBill = totalBill;
        await saleInvoice.save();

        return res.status(200).json({
            message: "Tạo hóa đơn bán hàng thành công!",
            saleInvoice,
            details: createdDetails
        });
    } catch(error) {
        console.error('Lỗi khi tạo hóa đơn bán hàng:', error);
        return next(error);
    }
}

// Update Sale Invoice
export const updateSaleInvoice = async (req, res, next) => {
    const { id } = req.params;
    const { userId, saleDate, details } = req.body; 
    try {
        const { value, error } = updateSaleInvoiceValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }   
        const updateSaleInvoice = await SaleInvoice.findByIdAndUpdate(id, {
            userId,
            saleDate,
        }, { new: true });
        if (!updateSaleInvoice) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn bán hàng để cập nhật"
            });
        }
        if (details) {
            await SaleInvoiceDetail.deleteMany({ saleInvoiceId: id });
            const newDetailInvoice = details.map(d => ({
                saleInvoiceId: updateSaleInvoice._id,
                batchId: d.batchId,
                productId: d.productId,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                totalPrice: d.unitPrice * d.quantity
            }));
            const newCreatedDetails = await SaleInvoiceDetail.insertMany(newDetailInvoice);
            const totalBill = newCreatedDetails.reduce((sum, d) => sum + d.totalPrice, 0);
            updateSaleInvoice.totalBill = totalBill;
            await updateSaleInvoice.save();
        }
        
        return res.status(200).json({
            message: "Cập nhật hóa đơn bán hàng thành công!",
            saleInvoice: updateSaleInvoice
        });
    } catch(error) {
        console.error('Lỗi khi cập nhật hóa đơn bán hàng:', error);
        return next(error);
    }
}

// Delete Sale Invoice
export const deleteSaleInvoice = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedSaleInvoice = await SaleInvoice.findById(id);
        if (!deletedSaleInvoice) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn bán hàng để xóa"
            });
        }
        await SaleInvoice.findByIdAndDelete(id);
        await SaleInvoiceDetail.deleteMany({ saleInvoiceId: id });

        return res.status(200).json({
            message: "Xóa hóa đơn bán hàng thành công!",
            saleInvoice: deletedSaleInvoice
        });
    } catch(error) {
        console.error('Lỗi khi xóa hóa đơn bán hàng:', error);
        return next(error);
    }
}

// Get All Sale Invoices
export const getSaleInvoiceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const saleInvoice = await SaleInvoice.findById(id)
            .populate('userId')
            .populate('statusId');
        if (!saleInvoice) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn bán hàng!"
            });
        }
        const detailInvoice = await SaleInvoiceDetail.find({ saleInvoiceId : id })
            .populate('batchId')
            .populate('productId');
        if (!detailInvoice) {
            return res.status(404).json({
                message: "Không tìm thấy chi tiết hóa đơn bán hàng!"
            });
        }

        return res.status(200).json({
            message: "Lấy hóa đơn bán hàng thành công!",
            saleInvoice,
            detailInvoice
        });
    } catch(error) {
        console.error('Lỗi khi lấy hóa đơn bán hàng:', error);
        return next(error);
    }
}

export const getAllSaleInvoices = async (req, res, next) => {
    try {
        const apiFeatures = new APIFeatures(SaleInvoice.find(), req.query)
            .filter()
            .sort()
            .paginate();
        const saleInvoices = await apiFeatures.query
            .populate('userId') 
            .populate('statusId');
        const countInvoices = new APIFeatures(SaleInvoice.find(), req.query)
            .filter();
        const totalInvoices = await SaleInvoice.countDocuments(countInvoices.query.getFilter());
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;  
        return res.status(200).json({
            message: "Lấy danh sách hóa đơn bán hàng thành công!",
            saleInvoices,
            pagination: getPaginationMeta(totalInvoices, page, limit)
        });
    } catch(error) {
        console.error('Lỗi khi lấy danh sách hóa đơn bán hàng:', error);
        return next(error);
    }
}
