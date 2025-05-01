const likeService = require('../services/likeService');
const { validateLike, validateLikeVideoId } = require('../validations/likeValidation');

const toggleLike = async (req, res) => {
    try {
        const { error } = validateLike(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const like = await likeService.toggleLike(req.body);
        res.status(200).json({
            success: true,
            message: 'Success toggle like',
            data: like
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat toggle like',
            error: error.message
        });
    }
}

const getLikes = async (req, res) => {
    try {
        const { error } = validateLikeVideoId(req.params);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const likes = await likeService.getLikesByVideoId(+req.params.videoId);
        res.status(200).json({
            success: true,
            message: 'Success get likes',
            data: likes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil like',
            error: error.message
        });
    }
}

module.exports = {
    getLikes,
    toggleLike
}