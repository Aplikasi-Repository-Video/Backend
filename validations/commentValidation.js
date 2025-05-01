const Joi = require('joi');

const validateComment = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(1).required().messages({
            'string.base': 'Komentar harus berupa teks.',
            'string.empty': 'Komentar tidak boleh kosong.',
            'string.min': 'Komentar harus memiliki minimal 1 karakter.',
            'any.required': 'Komentar wajib diisi.',
        }),
        user_id: Joi.number().required().messages({
            'number.base': 'ID user harus berupa angka.',
            'number.empty': 'ID user tidak boleh kosong.',
            'any.required': 'ID user wajib diisi.',
        }),
        video_id: Joi.number().required().messages({
            'number.base': 'ID video harus berupa angka.',
            'number.empty': 'ID video tidak boleh kosong.',
            'any.required': 'ID video wajib diisi.',
        })
    });
    return schema.validate(data);
};

const validateCommentId = (data) => {
    const schema = Joi.object({
        id: Joi.number().required().messages({
            'number.base': 'ID harus berupa angka.',
            'number.empty': 'ID tidak boleh kosong.',
            'any.required': 'ID wajib diisi.',
        })
    });
    return schema.validate(data);
};

const validateCommentVideoId = (data) => {
    const schema = Joi.object({
        videoId: Joi.number().required().messages({
            'number.base': 'ID video harus berupa angka.',
            'number.empty': 'ID video tidak boleh kosong.',
            'any.required': 'ID video wajib diisi.',
        })
    });
    return schema.validate(data);
};

module.exports = {
    validateComment,
    validateCommentId,
    validateCommentVideoId
};
