export const createCategorySchema = Joi.object({
    categoryName: Joi.string()
    .required()
    .messages({
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