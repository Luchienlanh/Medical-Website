import Joi from "joi"

export const createPurchaseInvoiceDetailValidator = Joi.object({
    purchaseInvoiceId: Joi.string().optional(),
    productId: Joi.string().optional(),
    quantity: Joi.number()
    .required()
    .min(1)
    .messages({
        'number.base': 'Số lượng phải là một số!',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1!',
        'any.required': 'Số lượng là bắt buộc!'
    }),
    unitPrice: Joi.number()
    .required()
    .min(0)
    .messages({
        'number.base': 'Đơn giá phải là một số!',
        'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0!',
        'any.required': 'Đơn giá là bắt buộc!'
    }),
})

export const updatePurchaseInvoiceDetailValidator = Joi.object({
    quantity: Joi.number()
    .min(1)
    .optional()
    .messages({
        'number.base': 'Số lượng phải là một số!',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1!'
    }),
    unitPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
        'number.base': 'Đơn giá phải là một số!',
        'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0!'
    })
})