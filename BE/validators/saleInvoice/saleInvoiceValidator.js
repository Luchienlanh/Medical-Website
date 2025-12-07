export const createSaleInvoiceValidator = Joi.object({
    userId: Joi.string().required(),
    saleDate: Joi.date()
    .default(() => new Date(), 'current date'),
    statusId: Joi.string().required()
})

export const updateSaleInvoiceValidator = Joi.object({
    saleDate: Joi.date()
    .optional()
    .messages({
        'date.base': 'Ngày bán không hợp lệ!'
    })
})