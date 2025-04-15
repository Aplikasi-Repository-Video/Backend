const videoService = require('../services/videoService');
const { validateVideo, validateVideoId, validateVideoUpdate } = require('../validations/videoValidation');

const getAllVideos = async (req, res) => {
    try {
        const videos = await videoService.getAllVideos();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVideoById = async (req, res) => {
    try {
        const { error } = validateVideoId.validate(req.params);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const video = await videoService.getVideoById(+req.params.id);
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVideo = async (req, res) => {
    try {
        const { error } = validateVideo.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const videoFile = req.files['video']?.[0];
        const thumbnailFile = req.files['thumbnail']?.[0];

        if (!videoFile || !thumbnailFile) {
            return res.status(400).json({ error: 'Video atau thumbnail tidak ditemukan' });
        }

        const video = await videoService.createVideo({
            title: req.body.title,
            description: req.body.description,
            category_id: req.body.category_id,
            user_id: req.body.user_id,
            videoFile,
            thumbnailFile
        });

        return res.status(201).json({ message: 'Video berhasil di-upload', data: video });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateVideo = async (req, res) => {
    try {
        const { error: videoIdError } = validateVideoId.validate(req.params);
        const { error: videoUpdateError } = validateVideoUpdate.validate(req.body);

        if (videoIdError || videoUpdateError) {
            return res.status(400).json({
                error: videoIdError ? videoIdError.details[0].message : videoUpdateError.details[0].message
            });
        }

        const videoFile = req.files?.['video']?.[0];
        const thumbnailFile = req.files?.['thumbnail']?.[0];

        const updated = await videoService.updateVideo(+req.params.id, {
            title: req.body.title,
            description: req.body.description,
            category_id: req.body.category_id,
            videoFile,
            thumbnailFile
        });

        return res.status(200).json({ message: 'Video berhasil diperbarui', data: updated });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { error } = validateVideoId.validate(req.params);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const deleted = await videoService.deleteVideo(+req.params.id);
        return res.status(200).json({ message: 'Video berhasil dihapus', data: deleted });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createVideo,
    updateVideo,
    getAllVideos,
    getVideoById,
    deleteVideo
};