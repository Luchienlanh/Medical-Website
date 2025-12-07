export const createOrderStatusValidator = Joi.object({
    statusName: Joi.string()
    .required()
    .valid('Pending', 'Processing', 'Completed', 'Cancelled')
    .messages({
        'any.required': 'Trạng thái đơn hàng là bắt buộc!',
        'string.empty': 'Trạng thái đơn hàng không được để trống!',
        'any.only': 'Trạng thái đơn hàng không hợp lệ!'
    })
})

export const updateOrderStatusValidator = Joi.object({
    statusName: Joi.string()
    .valid('Pending', 'Processing', 'Completed', 'Cancelled')
    .messages({
        'string.empty': 'Trạng thái đơn hàng không được để trống!',
        'any.only': 'Trạng thái đơn hàng không hợp lệ!'
    })
    .optional()
})