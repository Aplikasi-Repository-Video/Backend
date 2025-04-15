const Joi = require('joi');

const validateLike = (data) => {
    return Joi.object({
        user_id: Joi.number().required(),
        video_id: Joi.number().required()
    }).validate(data);
};

const validateLikeId = (data) => {
    return Joi.object({
        id: Joi.number().required()
    }).validate(data);
};

const validateLikeVideoId = (data) => {
    return Joi.object({
        videoId: Joi.number().required()
    }).validate(data);
};

module.exports = {
    validateLikeId,
    validateLike,
    validateLikeVideoId
};
