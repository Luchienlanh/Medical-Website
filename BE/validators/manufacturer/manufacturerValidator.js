export const createManufacturerSchema = Joi.object({
    manufacturerName: Joi.string()
    .required()
    .messages({
        'any.required': 'Tên nhà sản xuất là bắt buộc!',
        'string.empty': 'Tên nhà sản xuất không được để trống!'
    }),
    address: Joi.string().optional(),
    phoneNum: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
        'string.pattern.base': 'Số điện thoại phải có 10 chữ số!'
    })
})

export const updateManufacturerSchema = Joi.object({
    manufacturerName: Joi.string()
    .optional()
    .messages({
        'string.empty': 'Tên nhà sản xuất không được để trống!'
    }),
    address: Joi.string().optional(),
    phoneNum: Joi.string()
    .optional()
    .pattern(/^[0-9]{10}$/)
    .messages({
        'string.pattern.base': 'Số điện thoại phải có 10 chữ số!'
    })
})