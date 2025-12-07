import Joi from "joi"

export const createProductSchema = Joi.object({
    productName: Joi.string()
    .required()
    .messages({
        'string.empty': 'Tên sản phẩm không được để trống!'
    }),
    manufacturerId: Joi.string().required(),
    categoryId: Joi.string().required(),
    img: Joi.string().uri().optional(),
    productDesc: Joi.string().optional(),
    packagingType: Joi.string()
    .required()
    .valid('Blister', 'Box', 'Bottle', 'Tube', 'Sachet', 'Ampoule', 'Vial', 'Bag')
    .messages({
        'string.empty': 'Loại bao bì không được để trống!',
        'any.only': 'Loại bao bì không hợp lệ!'
    }),
    status: Joi.boolean().optional()
})

export const updateProductSchema = Joi.object({
    productName: Joi.string().optional(),
    img: Joi.string().uri().optional(),
    productDesc: Joi.string().optional(),
    packagingType: Joi.string()
    .optional()
    .valid('Blister', 'Box', 'Bottle', 'Tube', 'Sachet', 'Ampoule', 'Vial', 'Bag')
    .messages({
        'any.only': 'Loại bao bì không hợp lệ!'
    }),
    status: Joi.boolean().optional()
})

