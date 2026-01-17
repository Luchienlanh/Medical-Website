import Joi from "joi"
import { createPurchaseInvoiceDetailValidator } from "./purchaseInvoiceDetailValidator";

export const createPurchaseInvoiceValidator = Joi.object({
    manufacturerId: Joi.string().optional(),
    dateImport: Joi.date()
    .required()
    .messages({
        'date.base': 'Ngày nhập không hợp lệ!',
        'any.required': 'Ngày nhập là bắt buộc!'
    }),
    details: Joi.array()
    .items(createPurchaseInvoiceDetailValidator)
    .min(1)
    .required()
    .messages({
        'any.base': 'Chi tiết hóa đơn không hợp lệ!',
        'array.min': 'Chi tiết hóa đơn phải có ít nhất 1 sản phẩm!',
    })    
})

export const updatePurchaseInvoiceValidator = Joi.object({
    dateImport: Joi.date()
    .messages({
        'date.base': 'Ngày nhập không hợp lệ!'
    })
    .optional(),
    details: Joi.array()
    .items(createPurchaseInvoiceDetailValidator)
    .min(1)
    .optional()
    .messages({
        'any.base': 'Chi tiết hóa đơn không hợp lệ!',
        'array.min': 'Chi tiết hóa đơn phải có ít nhất 1 sản phẩm!',
    })
})