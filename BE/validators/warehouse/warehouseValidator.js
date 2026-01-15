import Joi from "joi"

export const createWarehouseSchema = Joi.object({
    warehouseName: Joi.string()
    .required()
    .messages({
        'any.required': 'Tên nhà kho là bắt buộc!',
        'string.empty': 'Tên nhà kho không được để trống!'
    }),
    address: Joi.string().optional(),
    status: Joi.boolean().required()
})

export const updateWarehouseSchema = Joi.object({
    warehouseName: Joi.string().optional(),
    address: Joi.string().optional(),
    status: Joi.boolean().optional()
})