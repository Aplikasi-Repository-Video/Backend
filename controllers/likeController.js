const likeService = require('../services/likeService');
const { validateLike, validateLikeId, validateLikeVideoId } = require('../validations/likeValidation');

const createLike = async (req, res) => {
    try {
        const { error } = validateLike(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const like = await likeService.likeVideo(req.body);
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

const deleteLike = async (req, res) => {
    try {
        const { error } = validateLikeId(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const like = await likeService.unlikeVideo(req.params.id);
        res.status(200).json(like);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

const getLikes = async (req, res) => {
    try {
        const { error } = validateLikeVideoId(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const likes = await likeService.getLikesByVideoId(req.params.id);
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createLike,
    deleteLike,
    getLikes
}