export const createPurchaseInvoiceValidator = Joi.object({
    manufacturerId: Joi.string().required(),
    dateImport: Joi.date()
    .required()
    .messages({
        'date.base': 'Ngày nhập không hợp lệ!',
        'any.required': 'Ngày nhập là bắt buộc!'
    }),
    totalBill: Joi.number()
    .min(1)
    .messages({
        'number.base': 'Tổng hóa đơn phải là một số!',
        'number.min': 'Tổng hóa đơn phải lớn hơn hoặc bằng 1đ!'
    })
})

export const updatePurchaseInvoiceValidator = Joi.object({
    dateImport: Joi.date()
    .messages({
        'date.base': 'Ngày nhập không hợp lệ!'
    })
    .optional(),
    totalBill: Joi.number()
    .min(1)
    .messages({ 
        'number.base': 'Tổng hóa đơn phải là một số!',
        'number.min': 'Tổng hóa đơn phải lớn hơn hoặc bằng 1đ!'
    })
    .optional()
})