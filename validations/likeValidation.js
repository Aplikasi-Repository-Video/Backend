const Joi = require('joi');

const validateLike = (data) => {
    const schema = Joi.object({
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
    }); return schema.validate(data);
};

const validateLikeVideoId = (data) => {
    const schema = Joi.object({
        videoId: Joi.number().required().messages({
            'number.base': 'ID video harus berupa angka.',
            'number.empty': 'ID video tidak boleh kosong.',
            'any.required': 'ID video wajib diisi.',
        })
    }); return schema.validate(data);
};

module.exports = {
    validateLike,
    validateLikeVideoId
};
