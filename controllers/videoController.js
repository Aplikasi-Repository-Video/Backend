const videoService = require('../services/videoService');

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
        const video = await videoService.getVideoById(+req.params.id);
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVideo = async (req, res) => {
    try {
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

module.exports = {
    createVideo,
    getAllVideos,
    getVideoById
};