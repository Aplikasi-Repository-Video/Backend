const commentService = require('../services/commentService');
const { validateComment, validateCommentId, validateCommentVideoId } = require('../validations/commentValidation');

const createComment = async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return res.status(400).json({ error: error.message });
        console.log(req.body);
        const comment = await commentService.createComment(req.body);
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { error } = validateCommentVideoId(req.params);
        if (error) return res.status(400).json({ error: error.message });

        const comments = await commentService.getCommentsByVideoId(+req.params.videoId);
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { error } = validateCommentId(req.params);
        if (error) return res.status(400).json({ error: error.message });

        const comment = await commentService.deleteComment(+req.params.id);
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createComment,
    deleteComment,
    getComments
};
