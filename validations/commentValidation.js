const Joi = require('joi');

const validateComment = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(1).required(),
        user_id: Joi.number().required(),
        video_id: Joi.number().required()
    });
    return schema.validate(data);
};

const validateCommentId = (data) => {
    const schema = Joi.object({
        id: Joi.number().required()
    });
    return schema.validate(data);
};

const validateCommentVideoId = (data) => {
    const schema = Joi.object({
        videoId: Joi.number().required()
    });
    return schema.validate(data);
};

module.exports = {
    validateComment,
    validateCommentId,
    validateCommentVideoId
};
