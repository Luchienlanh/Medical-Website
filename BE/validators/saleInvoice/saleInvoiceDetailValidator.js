export const createSaleInvoiceDetailValidator = Joi.object({
    saleInvoiceId: Ji.string().required(),
    batchId: Joi.string().required(),
    productId: Joi.string().required(),
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
    })
})

export const updateSaleInvoiceDetailValidator = Joi.object({
    quantity: Joi.number()
    .min(1)
    .messages({
        'number.base': 'Số lượng phải là một số!',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1!'
    })
    .optional(),
    unitPrice: Joi.number()
    .min(0)
    .messages({
        'number.base': 'Đơn giá phải là một số!',
        'number.min': 'Đơn giá phải lớn hơn hoặc bằng 0!'
    })
    .optional()
})