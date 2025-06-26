const commentService = require('../services/commentService');
const { validateComment, validateCommentId, validateCommentVideoId } = require('../validations/commentValidation');

const createComment = async (req, res, next) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const comment = await commentService.createComment(req.body);
        res.status(201).json({
            success: true,
            message: 'Berhasil membuat komentar',
            data: comment
        });
    } catch (err) {
        next(err);
    }
};

const getAllComments = async (req, res, next) => {
    try {
        const comments = await commentService.getAllComments();
        res.status(200).json({
            success: true,
            message: 'Berhasil mendapatkan semua komentar',
            data: comments
        });
    } catch (err) {
        next(err);
    }
};

const getComments = async (req, res, next) => {
    try {
        const { error } = validateCommentVideoId(req.params);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const comments = await commentService.getCommentsByVideoId(+req.params.videoId);
        res.status(200).json({
            success: true,
            message: 'Berhasil mendapatkan komentar',
            data: comments
        });
    } catch (err) {
        next(err);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { error } = validateCommentId(req.params);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const comment = await commentService.deleteComment(+req.params.id);
        res.status(200).json({
            success: true,
            message: 'Berhasil menghapus komentar',
            data: comment
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllComments,
    createComment,
    deleteComment,
    getComments
};
