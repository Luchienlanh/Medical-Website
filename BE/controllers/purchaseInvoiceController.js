import { PurchaseInvoice } from "../models/purchaseInvoice/PurchaseInvoice.js";
import { PurchaseInvoiceDetail } from "../models/purchaseInvoice/PurchaseInvoiceDetail.js";
import { createPurchaseInvoiceValidator, updatePurchaseInvoiceValidator } from "../validators/purchaseInvoice/purchaseInvoiceValidator.js";
import { APIFeatures, getPaginationMeta } from "../utils/apiFeatures.js";
import dotenv from "dotenv";
dotenv.config();

// Create
export const createPurchaseInvoice = async (req, res, next) => {
    const { manufacturerId, dateImport, details } = req.body;
    try {
        const { value, error } = createPurchaseInvoiceValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        // const existingInvoice = await PurchaseInvoice.findOne({ })
        const purchaseInvoice = await PurchaseInvoice.create({
            manufacturerId,
            dateImport,
            // details
        });
        const detailInvoice = details.map(d => ({
            purchaseInvoiceId: purchaseInvoice._id,
            productId: d.productId,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            totalPrice: d.unitPrice * d.quantity
        }));
        const createdDetails = await PurchaseInvoiceDetail.insertMany(detailInvoice);
        const totalBill = createdDetails.reduce((sum, d) => sum + d.totalPrice, 0);
        purchaseInvoice.totalBill = totalBill;
        await purchaseInvoice.save();

        return res.status(200).json({
            message: "Tạo hóa đơn nhập hàng thành công!",
            purchaseInvoice,
            details: createdDetails
        });
    } catch(error) {
        console.error('Lỗi khi tạo hóa đơn nhập hàng:', error);
        return next(error);
    }
}

// Update
export const updatePurchaseInvoice = async (req, res, next) => {
    const { id } = req.params;
    const { manufacturerId, dateImport, details } = req.body;
    try {
        const { value, error } = updatePurchaseInvoiceValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const updatePurchaseInvoice = await PurchaseInvoice.findByIdAndUpdate(id, {
            manufacturerId,
            dateImport,
            // details
        }, { new: true});
        if (!updatePurchaseInvoice) {
            return res.status(404).json({
                message: "Không tìm thấy hóa đơn nhập hàng!"
            });
        }
        if (details) {
            await PurchaseInvoiceDetail.deleteMany({ purchaseInvoiceId: id });
            const newDetailInvoice = details.map(d => ({
                purchaseInvoiceId: id,
                productId: d.productId,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                totalPrice: d.unitPrice * d.quantity
            }));
            const newCreatedDetail = await PurchaseInvoiceDetail.insertMany(newDetailInvoice);
            const newTotalBill = newCreatedDetail.reduce((sum, d) => sum + d.totalPrice, 0);
            updatePurchaseInvoice.totalBill = newTotalBill;
            await updatePurchaseInvoice.save();
        }
        return res.status(200).json({
            message: "Cập nhật hóa đơn nhập hàng thành công!",
            updatePurchaseInvoice
        });
    } catch(error) {
        console.error('Lỗi khi cập nhật hóa đơn nhập hàng:', error);
        return next(error);
    }
}

// Delete 
export const deletePurchaseInvoice = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletePurchaseInvoice = await PurchaseInvoice.findById(id);
        if (!deletePurchaseInvoice) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn!'
            });
        }
        await PurchaseInvoice.findByIdAndDelete(id);
        await PurchaseInvoiceDetail.deleteMany({ purchaseInvoiceId: id });

        return res.status(200).json({
            message: 'Xóa hóa đơn thành công!'
        });
    } catch(error) {
        console.error('Lỗi khi xóa hóa đơn:', error);
        return next(error);
    }
}

// Get All
export const getPurchaseInvoiceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const purchaseInvoice = await PurchaseInvoice.findById(id)
            .populate('manufacturerId');
        if (!purchaseInvoice) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn!'
            });
        }
        const detailInvoice = await PurchaseInvoiceDetail.find({ purchaseInvoiceId : id })
            .populate('productId');
        if (!detailInvoice) {
            return res.status(404).json({
                message: 'Không tìm thấy chi tiết hóa đơn!'
            });
        }
        return res.status(200).json({
            message: 'Lấy hóa đơn thành công!',
            purchaseInvoice,
            detailInvoice
        });
    } catch(error) {
        console.error('Lỗi khi lấy hóa đơn:', error);
        return next(error);
    }
}

// Get All with Pagination
export const getAllPurchaseInvoices = async (req, res, next) => {
    try {
        if (!req.query.sort) {
            req.query.sort = '-dateImport';
        }
        const apiFeatures = new APIFeatures(PurchaseInvoice.find(), req.query)
            .filter()
            .sort()
            .paginate();
        const purchaseInvoices = await apiFeatures.query
            .populate('manufacturerId');
        const countInvoices = new APIFeatures(PurchaseInvoice.find(), req.query)
            .filter();
        const totalInvoices = await PurchaseInvoice.countDocuments(countInvoices.query.getFilter());
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pagination = getPaginationMeta(totalInvoices, page, limit);
        return res.status(200).json({
            message: 'Lấy danh sách hóa đơn thành công!',
            purchaseInvoices,
            pagination
        }); 
    } catch(error) {
        console.error('Lỗi khi lấy danh sách hóa đơn:', error);
        return next(error);
    }
}
