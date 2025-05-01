const Joi = require('joi');

const validateCreateUser = Joi.object({
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
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.base': 'Konfirmasi password harus berupa teks.',
        'string.empty': 'Konfirmasi password tidak boleh kosong.',
        'any.only': 'Konfirmasi password tidak cocok.',
        'any.required': 'Konfirmasi password wajib diisi.',
    })
})

const baseUserSchema = {
    name: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'Nama harus berupa teks.',
        'string.empty': 'Nama tidak boleh kosong.',
        'string.min': 'Nama harus memiliki minimal 3 karakter.',
        'string.max': 'Nama tidak boleh lebih dari 50 karakter.',
        'any.required': 'Nama wajib diisi.',
    }),
    email: Joi.string().email().optional().messages({
        'string.base': 'Email harus berupa teks.',
        'string.email': 'Format email tidak valid.',
        'string.empty': 'Email tidak boleh kosong.',
        'any.required': 'Email wajib diisi.',
    }),
    password: Joi.string().min(6).optional().messages({
        'string.base': 'Password harus berupa teks.',
        'string.empty': 'Password tidak boleh kosong.',
        'string.min': 'Password harus memiliki minimal 6 karakter.',
    })
};

const validateUser = Joi.object(baseUserSchema);

const validateUserAdmin = Joi.object({
    ...baseUserSchema,
    role: Joi.string().valid('USER', 'ADMIN').optional().messages({
        'any.only': 'Role hanya boleh USER atau ADMIN.'
    }),
    isActive: Joi.boolean().optional().messages({
        'boolean.base': 'isActive harus berupa boolean.'
    })
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
    validateUserEmail,
    validateUserAdmin,
    validateCreateUser
};
