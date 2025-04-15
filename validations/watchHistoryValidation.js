const Joi = require('joi');

const validateWatchHistory = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().optional(),
        guest_id: Joi.string().optional(),
        video_id: Joi.number().required(),
        duration_watch: Joi.string().min(1).required()
    }).or('user_id', 'guest_id') // harus ada salah satu

    return schema.validate(data);
};

const validateWatchHistoryId = (data) => {
    const schema = Joi.object({
        id: Joi.number().required()
    });
    return schema.validate(data);
};

const validateWatchHistoryUserId = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().optional(),
        guest_id: Joi.string().optional().min(1),  // Pastikan guest_id ada dan bukan kosong
    }).or('user_id', 'guest_id'); // Pastikan hanya salah satu yang ada
    return schema.validate(data);
};


module.exports = {
    validateWatchHistory,
    validateWatchHistoryId,
    validateWatchHistoryUserId
};
