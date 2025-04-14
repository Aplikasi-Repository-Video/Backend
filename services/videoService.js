const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadFromBuffer = require('../utils/uploadFromBuffer');
const upload = require('../middleware/upload');


const getAllVideos = async () => {
    return await prisma.video.findMany();
}

const getVideoById = async (id) => {
    return await prisma.video.findUnique({
        where: {
            id: id
        }
    });
}

const createVideo = async ({ title, description, category_id, user_id, videoFile, thumbnailFile }) => {
    const uploadedVideo = await uploadFromBuffer(videoFile.buffer, 'videos', 'video');
    const uploadedThumbnail = await uploadFromBuffer(thumbnailFile.buffer, 'thumbnails', 'image');

    function secondsToHMS(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
    const durationFormatted = secondsToHMS(uploadedVideo.duration);


    const newVideo = await prisma.video.create({
        data: {
            title,
            description,
            duration: durationFormatted,
            video_url: uploadedVideo.secure_url,
            thumbnail_url: uploadedThumbnail.secure_url,
            category_id: category_id ? parseInt(category_id) : null,
            user_id: parseInt(user_id),
            created: new Date(),
            updated: new Date()
        }
    });

    return newVideo;
};

const updateVideo = async (id, video) => {
    return await prisma.video.update({
        where: {
            id: id
        },
        data: video
    });
}

const deleteVideo = async (id) => {
    return await prisma.video.delete({
        where: {
            id: id
        }
    });
}

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
};