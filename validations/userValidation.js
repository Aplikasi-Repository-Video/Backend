const Joi = require('joi');

const validateUser = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Nama harus berupa teks.',
        'string.empty': 'Nama tidak boleh kosong.',
        'string.min': 'Nama harus memiliki minimal 3 karakter.',
        'string.max': 'Nama tidak boleh lebih dari 50 karakter.',
        'any.required': 'Nama wajib diisi.',
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email harus berupa teks.',
        'string.email': 'Format email tidak valid.',
        'string.empty': 'Email tidak boleh kosong.',
        'any.required': 'Email wajib diisi.',
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password harus berupa teks.',
        'string.empty': 'Password tidak boleh kosong.',
        'string.min': 'Password harus memiliki minimal 6 karakter.',
        'any.required': 'Password wajib diisi.',
    }),
});

const validateUserId = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'ID harus berupa angka.',
        'number.empty': 'ID tidak boleh kosong.',
        'any.required': 'ID wajib diisi.',
    }),

});

const validateUserEmail = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': 'Email harus berupa teks.',
        'string.email': 'Format email tidak valid.',
        'string.empty': 'Email tidak boleh kosong.',
        'any.required': 'Email wajib diisi.',
    }),
});

module.exports = {
    validateUser,
    validateUserId,
    validateUserEmail
};
