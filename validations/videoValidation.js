const Joi = require('joi');

const validateVideo = Joi.object({
    user_id: Joi.number().required().messages({
        'number.base': 'ID user harus berupa angka.',
        'number.empty': 'ID user tidak boleh kosong.',
        'any.required': 'ID user wajib diisi.',
    }),
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
    video_url: Joi.string().required().messages({
        'string.base': 'URL video harus berupa teks.',
        'string.empty': 'URL video tidak boleh kosong.',
        'any.required': 'URL video wajib diisi.',
    }),
    thumbnail_url: Joi.string().required().messages({
        'string.base': 'URL thumbnail harus berupa teks.',
        'string.empty': 'URL thumbnail tidak boleh kosong.',
        'any.required': 'URL thumbnail wajib diisi.',
    }),
    duration: Joi.number().min(1).required().messages({
        'number.base': 'Durasi harus berupa angka.',
        'number.empty': 'Durasi tidak boleh kosong.',
        'number.min': 'Durasi harus memiliki minimal 1 detik.',
        'any.required': 'Durasi wajib diisi.',
    }),
})

const validateVideoId = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'ID harus berupa angka.',
        'number.empty': 'ID tidak boleh kosong.',
        'any.required': 'ID wajib diisi.',
    }),
})

const validateVideoUpdate = Joi.object({
    title: Joi.string().min(3).messages({
        'string.base': 'Judul harus berupa teks.',
        'string.empty': 'Judul tidak boleh kosong.',
        'string.min': 'Judul harus memiliki minimal 3 karakter.',
    }),
    description: Joi.string().min(3).messages({
        'string.base': 'Deskripsi harus berupa teks.',
        'string.empty': 'Deskripsi tidak boleh kosong.',
        'string.min': 'Deskripsi harus memiliki minimal 3 karakter.',
    }),
    category_id: Joi.number().required().messages({
        'number.base': 'ID kategori harus berupa angka.',
        'number.empty': 'ID kategori tidak boleh kosong.',
        'any.required': 'ID kategori wajib diisi.',
    }),
    video_url: Joi.string().messages({
        'string.base': 'URL video harus berupa teks.',
        'string.empty': 'URL video tidak boleh kosong.',
    }),
    thumbnail_url: Joi.string().messages({
        'string.base': 'URL thumbnail harus berupa teks.',
        'string.empty': 'URL thumbnail tidak boleh kosong.',
    }),
    duration: Joi.number().min(1).messages({
        'number.base': 'Durasi harus berupa angka.',
        'number.empty': 'Durasi tidak boleh kosong.',
        'number.min': 'Durasi harus memiliki minimal 1 detik.',
    }),
})

module.exports = {
    validateVideo,
    validateVideoId,
    validateVideoUpdate
}