export const createProductBatchSchema = Joi.object({
    productId: Joi.string()
    .optional()
    .messages({
        'string.empty': 'Mã sản phẩm không được để trống!'
    }),
    purchaseInvoiceId: Joi.string()
    .optional()
    .messages({
        'string.empty': 'Mã hóa đơn nhập hàng không được để trống!'
    }),
    manufactureDate: Joi.date()
    .required()
    .messages({
        'any.required': 'Ngày sản xuất là bắt buộc!',
        'date.base': 'Ngày sản xuất không hợp lệ!'
    }),
    expiryDate: Joi.date()
    .required()
    .messages({
        'any.required': 'Ngày hết hạn là bắt buộc!',
        'date.base': 'Ngày hết hạn không hợp lệ!'
    }),
    quantity: Joi.number()
    .required()
    .min(1)
    .messages({
        'any.required': 'Số lượng là bắt buộc!',
        'number.base': 'Số lượng phải là một số!'   
    }),
    dosage: Joi.string()
    .required()
    .messages({
        'any.required': 'Liều lượng là bắt buộc!',
        'string.empty': 'Liều lượng không được để trống!'
    }),
    administration: Joi.string()
    .required()
    .messages({
        'any.required': 'Cách dùng là bắt buộc!',
        'string.empty': 'Cách dùng không được để trống!'
    })
})

export const updateProductBatchSchema = Joi.object({
    manufactureDate: Joi.date()
    .optional()
    .messages({
        'date.base': 'Ngày sản xuất không hợp lệ!'
    }),
    expiryDate: Joi.date()
    .optional()
    .messages({
        'date.base': 'Ngày hết hạn không hợp lệ!'
    }),
    quantity: Joi.number()
    .optional()
    .min(1)
    .messages({
        'number.base': 'Số lượng phải là một số!'
    }),
    dosage: Joi.string()
    .optional()
    .messages({
        'string.empty': 'Liều lượng không được để trống!'
    }),
    administration: Joi.string()
    .optional()
    .messages({
        'string.empty': 'Cách dùng không được để trống!'
    })
})

