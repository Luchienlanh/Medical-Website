export const createCategorySchema = Joi.object({
    categoryName: Joi.string()
    .required()
    .messages({
        'any.required': 'Tên loại sản phẩm là bắt buộc!',
        'string.empty': 'Tên loại sản phẩm không được để trống!'
    })
})

export const updateCategorySchema = Joi.object({
    categoryName: Joi.string()
    .optional()
    .messages({
        'string.empty': 'Tên loại sản phẩm không được để trống!'
    })
})