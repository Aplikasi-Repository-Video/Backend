const Joi = require('joi');

const validateWatchHistory = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().optional().messages({
            'number.base': 'ID user harus berupa angka.',
            'number.empty': 'ID user tidak boleh kosong.',
            'any.required': 'ID user wajib diisi.',
        }),
        guest_id: Joi.string().optional().messages({
            'string.base': 'ID guest harus berupa string.',
            'string.empty': 'ID guest tidak boleh kosong.',
            'any.required': 'ID guest wajib diisi.',
        }),
        video_id: Joi.number().required().messages({
            'number.base': 'ID video harus berupa angka.',
            'number.empty': 'ID video tidak boleh kosong.',
            'any.required': 'ID video wajib diisi.',
        }),
        duration_watch: Joi.number().min(1).required().messages({
            'number.base': 'Durasi harus berupa angka.',
            'number.empty': 'Durasi tidak boleh kosong.',
            'number.min': 'Durasi harus memiliki minimal 1 detik.',
            'any.required': 'Durasi wajib diisi.',
        })
    }).or('user_id', 'guest_id')
    return schema.validate(data);
};

const validateWatchHistoryId = (data) => {
    const schema = Joi.object({
        id: Joi.number().required().messages({
            'number.base': 'ID harus berupa angka.',
            'number.empty': 'ID tidak boleh kosong.',
            'any.required': 'ID wajib diisi.',
        })
    });
    return schema.validate(data);
};

const validateWatchHistoryUserId = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().optional().messages({
            'number.base': 'ID user harus berupa angka.',
            'number.empty': 'ID user tidak boleh kosong.',
            'any.required': 'ID user wajib diisi.',
        }),
        guest_id: Joi.string().optional().min(1).messages({
            'string.base': 'ID guest harus berupa string.',
            'string.empty': 'ID guest tidak boleh kosong.',
            'any.required': 'ID guest wajib diisi.',
        }),
    }).or('user_id', 'guest_id');
    return schema.validate(data);
};

const validateWatchHistoryDurationWatch = (data) => {
    const schema = Joi.object({
        duration_watch: Joi.number().min(1).required().messages({
            'number.base': 'Durasi harus berupa angka.',
            'number.empty': 'Durasi tidak boleh kosong.',
            'number.min': 'Durasi harus memiliki minimal 1 detik.',
            'any.required': 'Durasi wajib diisi.',
        })
    });
    return schema.validate(data);
}

module.exports = {
    validateWatchHistory,
    validateWatchHistoryId,
    validateWatchHistoryUserId,
    validateWatchHistoryDurationWatch
};
