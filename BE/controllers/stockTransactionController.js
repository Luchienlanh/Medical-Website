import { StockTransaction } from '../models/transaction/StockTransaction.js';
import { ProductBatch } from '../models/product/ProductBatch.js';
import { createStockTransactionValidator, updateStockTransactionValidator } from '../validators/transaction/stockTransactionValidator.js';
import { APIFeatures, getPaginationMeta } from '../utils/apiFeatures.js';
import dotenv from 'dotenv';
dotenv.config();

// ==========================================
// CREATE STOCK TRANSACTION
// ==========================================
export const createStockTransaction = async (req, res, next) => {
    const { batchId, warehouseId, transactionType, quantity, transactionDate, relatedInvoiceId } = req.body;

    try {
        // BƯỚC 1: Validate
        const { error } = createStockTransactionValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        // BƯỚC 2: Tìm ProductBatch
        const batch = await ProductBatch.findById(batchId);
        if (!batch) {
            return res.status(404).json({
                message: 'Không tìm thấy lô hàng!'
            });
        }

        // BƯỚC 3: Validate quantity theo transaction type
        if (transactionType === 'EXPORT') {
            // Kiểm tra số lượng tồn kho
            if (batch.remainingQuantity < quantity) {
                return res.status(400).json({
                    message: `Không đủ hàng tồn kho! Số lượng còn lại: ${batch.remainingQuantity}`,
                    remainingQuantity: batch.remainingQuantity
                });
            }
        }

        // BƯỚC 4: Update remainingQuantity của ProductBatch
        let newRemainingQuantity;
        
        switch(transactionType) {
            case 'IMPORT':
                // Nhập kho → Tăng tồn kho
                newRemainingQuantity = batch.remainingQuantity + quantity;
                break;
            
            case 'EXPORT':
                // Xuất kho → Giảm tồn kho
                newRemainingQuantity = batch.remainingQuantity - quantity;
                break;
            
            case 'ADJUST':
                // Điều chỉnh → Set số lượng mới
                newRemainingQuantity = quantity;
                break;
            
            default:
                return res.status(400).json({
                    message: 'Loại giao dịch không hợp lệ!'
                });
        }

        // BƯỚC 5: Tạo StockTransaction record
        const transaction = await StockTransaction.create({
            batchId,
            warehouseId,
            transactionType,
            quantity,
            transactionDate,
            relatedInvoiceId
        });

        // BƯỚC 6: Update ProductBatch
        batch.remainingQuantity = newRemainingQuantity;
        await batch.save();

        return res.status(201).json({
            message: 'Tạo giao dịch kho thành công!',
            transaction,
            batch: {
                _id: batch._id,
                oldQuantity: batch.remainingQuantity + (transactionType === 'IMPORT' ? -quantity : quantity),
                newQuantity: batch.remainingQuantity
            }
        });

    } catch(error) {
        console.error('Lỗi tạo giao dịch kho:', error);
        return next(error);
    }
};

// ==========================================
// GET ALL STOCK TRANSACTIONS
// ==========================================
export const getAllStockTransactions = async (req, res, next) => {
    try {
        // Default sort: mới nhất trước
        if (!req.query.sort) {
            req.query.sort = '-transactionDate';
        }

        const apiFeatures = new APIFeatures(StockTransaction.find(), req.query)
            .filter()
            .sort()
            .paginate();

        const transactions = await apiFeatures.query
            .populate('batchId', 'productId quantity remainingQuantity')
            .populate('warehouseId', 'warehouseName address');

        // Count total
        const countFeatures = new APIFeatures(StockTransaction.find(), req.query)
            .filter();
        const total = await StockTransaction.countDocuments(countFeatures.query.getFilter());

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pagination = getPaginationMeta(total, page, limit);

        return res.status(200).json({
            message: 'Lấy danh sách giao dịch kho thành công!',
            transactions,
            pagination
        });

    } catch(error) {
        console.error('Lỗi lấy danh sách giao dịch:', error);
        return next(error);
    }
};

// ==========================================
// GET STOCK TRANSACTION BY ID
// ==========================================
export const getStockTransactionById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const transaction = await StockTransaction.findById(id)
            .populate('batchId')
            .populate('warehouseId');

        if (!transaction) {
            return res.status(404).json({
                message: 'Không tìm thấy giao dịch kho!'
            });
        }

        return res.status(200).json({
            message: 'Lấy thông tin giao dịch thành công!',
            transaction
        });

    } catch(error) {
        console.error('Lỗi lấy giao dịch:', error);
        return next(error);
    }
};

// ==========================================
// GET TRANSACTIONS BY BATCH
// ==========================================
export const getTransactionsByBatch = async (req, res, next) => {
    const { batchId } = req.params;

    try {
        const transactions = await StockTransaction.find({ batchId })
            .populate('warehouseId')
            .sort('-transactionDate');

        return res.status(200).json({
            message: 'Lấy lịch sử giao dịch lô hàng thành công!',
            transactions
        });

    } catch(error) {
        console.error('Lỗi lấy lịch sử:', error);
        return next(error);
    }
};

// ==========================================
// UPDATE STOCK TRANSACTION (LIMITED)
// ==========================================
export const updateStockTransaction = async (req, res, next) => {
    const { id } = req.params;
    const { transactionDate } = req.body;

    try {
        // CHÍNH SÁCH: Chỉ cho phép sửa transactionDate
        // KHÔNG cho phép sửa quantity/type vì ảnh hưởng tồn kho
        
        const { error } = updateStockTransactionValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const transaction = await StockTransaction.findByIdAndUpdate(
            id,
            { transactionDate },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({
                message: 'Không tìm thấy giao dịch!'
            });
        }

        return res.status(200).json({
            message: 'Cập nhật giao dịch thành công!',
            transaction
        });

    } catch(error) {
        console.error('Lỗi cập nhật giao dịch:', error);
        return next(error);
    }
};

// ==========================================
// DELETE STOCK TRANSACTION (REVERSE OPERATION)
// ==========================================
export const deleteStockTransaction = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Tìm transaction
        const transaction = await StockTransaction.findById(id);
        if (!transaction) {
            return res.status(404).json({
                message: 'Không tìm thấy giao dịch!'
            });
        }

        // Tìm batch
        const batch = await ProductBatch.findById(transaction.batchId);
        if (!batch) {
            return res.status(404).json({
                message: 'Không tìm thấy lô hàng để hoàn tác!'
            });
        }

        // HOÀN TÁC remainingQuantity
        let newRemainingQuantity;
        
        switch(transaction.transactionType) {
            case 'IMPORT':
                // Hoàn tác nhập kho → Giảm tồn kho
                newRemainingQuantity = batch.remainingQuantity - transaction.quantity;
                if (newRemainingQuantity < 0) {
                    return res.status(400).json({
                        message: 'Không thể xóa giao dịch này! Số lượng tồn kho sẽ âm.'
                    });
                }
                break;
            
            case 'EXPORT':
                // Hoàn tác xuất kho → Tăng tồn kho
                newRemainingQuantity = batch.remainingQuantity + transaction.quantity;
                break;
            
            case 'ADJUST':
                return res.status(400).json({
                    message: 'Không thể xóa giao dịch điều chỉnh! Vui lòng tạo giao dịch mới.'
                });
            
            default:
                return res.status(400).json({
                    message: 'Loại giao dịch không hợp lệ!'
                });
        }

        // Update batch
        batch.remainingQuantity = newRemainingQuantity;
        await batch.save();

        // Delete transaction
        await StockTransaction.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Xóa giao dịch và hoàn tác tồn kho thành công!',
            batch: {
                _id: batch._id,
                newRemainingQuantity: batch.remainingQuantity
            }
        });

    } catch(error) {
        console.error('Lỗi xóa giao dịch:', error);
        return next(error);
    }
};

// ==========================================
// GET STOCK SUMMARY BY WAREHOUSE
// ==========================================
export const getStockSummaryByWarehouse = async (req, res, next) => {
    const { warehouseId } = req.params;

    try {
        // Aggregate để tính tổng IMPORT/EXPORT theo warehouse
        const summary = await StockTransaction.aggregate([
            { $match: { warehouseId: mongoose.Types.ObjectId(warehouseId) } },
            {
                $group: {
                    _id: '$transactionType',
                    totalQuantity: { $sum: '$quantity' },
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            message: 'Lấy tổng hợp kho thành công!',
            summary
        });

    } catch(error) {
        console.error('Lỗi lấy tổng hợp:', error);
        return next(error);
    }
};
