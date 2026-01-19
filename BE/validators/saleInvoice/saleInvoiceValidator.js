import Joi from "joi"
import { createSaleInvoiceDetailValidator } from "./saleInvoiceDetailValidator.js";

export const createSaleInvoiceValidator = Joi.object({
    userId: Joi.string().optional(),
    saleDate: Joi.date()
    .default(() => new Date()),
    statusId: Joi.string().optional(),
    details: Joi.array()
    .items(createSaleInvoiceDetailValidator)
    .min(1)
    .required()
    .messages({
        'any.base': 'Chi tiết hóa đơn không hợp lệ!',
        'array.min': 'Chi tiết hóa đơn phải có ít nhất 1 sản phẩm!',
    })
})

export const updateSaleInvoiceValidator = Joi.object({
    saleDate: Joi.date()
    .optional()
    .messages({
        'date.base': 'Ngày bán không hợp lệ!'
    }),
    details: Joi.array()
    .items(createSaleInvoiceDetailValidator)
    .min(1)
    .optional()
    .messages({
        'any.base': 'Chi tiết hóa đơn không hợp lệ!',
        'array.min': 'Chi tiết hóa đơn phải có ít nhất 1 sản phẩm!',
    })
})