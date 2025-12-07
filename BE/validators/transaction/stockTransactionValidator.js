export const createStockTransactionValidator = Joi.object({
    batchId: Joi.string().requird(),
    warehouseId: Joi.string().required(),
    transactionType: Joi.string()
    .required()
    .valid('IMPORT', 'EXPORT', 'ADJUST')
    .messages({
        'any.only': 'Kiểu giao dịch không hợp lệ. Chỉ chấp nhận IMPORT, EXPORT hoặc ADJUST',
        'string.empty': 'Kiểu giao dịch là bắt buộc!',
        'any.required': 'Kiểu giao dịch là bắt buộc!'
    }),
    quantity: Joi.number()
    .required()
    .min(1)
    .mesages({
        'number.base': 'Số lượng phải là một số!',
        'any.required': 'Số lượng là bắt buộc!'
    }),
    transactionDate: Joi.date()
    .required()
    .messages({
        'date.base': 'Ngày giao dịch không hợp lệ!',
        'any.required': 'Ngày giao dịch là bắt buộc!'
    }),
    relatedInvoiceId: Joi.string().required()
})

export const updateStockTransactionValidator = Joi.object({
    transactionType: Joi.string()
    .valid('IMPORT', 'EXPORT', 'ADJUST')
    .optional()
    .messages({
        'any.only': 'Kiểu giao dịch không hợp lệ. Chỉ chấp nhận IMPORT, EXPORT hoặc ADJUST'
    }),
    quantity: Joi.number().optional(),
    transactionDate: Joi.date()
    .optional()
    .messages({
        'date.base': 'Ngày giao dịch không hợp lệ!'
    }),
})