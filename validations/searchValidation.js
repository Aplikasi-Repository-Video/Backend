const Joi = require('joi');

const searchValidationSchema = Joi.object({
    keyword: Joi.string().min(3).required().messages({
        'string.base': 'Keyword harus berupa string',
        'string.empty': 'Keyword tidak boleh kosong',
        'string.min': 'Keyword minimal 3 karakter',
        'any.required': 'Keyword wajib diisi',
    }),
});

module.exports = {
    searchValidationSchema,
};
