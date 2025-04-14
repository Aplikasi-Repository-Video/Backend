const Joi = require('joi');

const validateCategory = Joi.object({
    name: Joi.string().min(3).max(50).required()
        .trim()
        .pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
        .required()
        .messages({
            'string.base': 'Nama harus berupa teks.',
            'string.empty': 'Nama tidak boleh kosong.',
            'string.pattern.base': 'Nama hanya boleh berisi huruf dan 1 jarak spasi.',
            'string.min': 'Nama harus memiliki minimal 3 karakter.',
            'string.max': 'Nama tidak boleh lebih dari 50 karakter.',
            'any.required': 'Nama wajib diisi.',
        }),
});

const validateCategoryId = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'ID harus berupa angka.',
        'number.empty': 'ID tidak boleh kosong.',
        'any.required': 'ID wajib diisi.',
    }),
});

module.exports = {
    validateCategory,
    validateCategoryId
}