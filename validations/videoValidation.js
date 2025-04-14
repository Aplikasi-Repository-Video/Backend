const Joi = require('joi');

const validateVideo = Joi.object({
    title: Joi.string().min(3).required().messages({
        'string.base': 'Judul harus berupa teks.',
        'string.empty': 'Judul tidak boleh kosong.',
        'string.min': 'Judul harus memiliki minimal 3 karakter.',
        'any.required': 'Judul wajib diisi.',
    }),
    description: Joi.string().min(3).required().messages({
        'string.base': 'Deskripsi harus berupa teks.',
        'string.empty': 'Deskripsi tidak boleh kosong.',
        'string.min': 'Deskripsi harus memiliki minimal 3 karakter.',
        'any.required': 'Deskripsi wajib diisi.',
    }),
    category_id: Joi.number().required().messages({
        'number.base': 'ID kategori harus berupa angka.',
        'number.empty': 'ID kategori tidak boleh kosong.',
        'any.required': 'ID kategori wajib diisi.',
    }),

})