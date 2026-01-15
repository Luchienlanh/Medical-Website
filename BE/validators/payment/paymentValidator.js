export const createPaymentValidator = Joi.object({
    saleInvoiceId: Joi.string().optional(),
    transactionId: Joi.string().optional(),
    paymentMethod: Joi.string()
    .required()
    .valid('Momo', 'ZaloPay', 'VNPAY', 'Cash')
    .messages({
        'any.only': 'Hình thức thanh toán không hợp lệ. Vui lòng chọn một trong các phương thức sau: Momo, ZaloPay, VNPAY, Cash.',
        'string.empty': 'Hình thức thanh toán không được để trống!',
        'any.required': 'Hình thức thanh toán là bắt buộc!'
    }),
    amount: Joi.number().required(),
    paymentStatus: Joi.string()
    .required()
    .valid('Pending', 'Success', 'Failed', 'Refunded')
    .messages({
        'any.only': 'Trạng thái thanh toán không hợp lệ. Vui lòng chọn một trong các trạng thái sau: Pending, Success, Failed, Refunded.',
        'string.empty': 'Trạng thái thanh toán không được để trống!',
        'any.required': 'Trạng thái thanh toán là bắt buộc!'
    }),
    paymentDate: Joi.date().required()
})

export const updatePaymentValidator = Joi.object({
    paymentMethod: Joi.string()
    .valid('Momo', 'ZaloPay', 'VNPAY', 'Cash')
    .optional()
    .messages({
        'any.only': 'Hình thức thanh toán không hợp lệ. Vui lòng chọn một trong các phương thức sau: Momo, ZaloPay, VNPAY, Cash.',
        'string.empty': 'Hình thức thanh toán không được để trống!'
    }),
    amount: Joi.number().optional(),
    paymentStatus: Joi.string()
    .valid('Pending', 'Success', 'Failed', 'Refunded')
    .optional()
    .messages({
        'any.only': 'Trạng thái thanh toán không hợp lệ. Vui lòng chọn một trong các trạng thái sau: Pending, Success, Failed, Refunded.',
        'string.empty': 'Trạng thái thanh toán không được để trống!'
    }),
    paymentDate: Joi.date().optional()
})