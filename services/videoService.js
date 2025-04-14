const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uploadFromBuffer = require('../utils/uploadFromBuffer');
const upload = require('../middleware/upload');
const { deleteFromCloudinary } = require('../utils/cloudinary'); // kamu buat ini sendiri


const getAllVideos = async () => {
    return await prisma.video.findMany();
}

const getVideoById = async (id) => {
    const video = await prisma.video.findUnique({
        where: {
            id: id
        }
    });

    if (!video) {
        throw new Error('Video tidak ditemukan');
    }

    return video;
}

function secondsToHMS(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

const createVideo = async ({ title, description, category_id, user_id, videoFile, thumbnailFile }) => {
    const uploadedVideo = await uploadFromBuffer(videoFile.buffer, 'videos', 'video');
    const uploadedThumbnail = await uploadFromBuffer(thumbnailFile.buffer, 'thumbnails', 'image');

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

const updateVideo = async (id, { title, description, category_id, videoFile, thumbnailFile }) => {
    const existingVideo = await getVideoById(id);

    let video_url = existingVideo.video_url;
    let thumbnail_url = existingVideo.thumbnail_url;
    let duration = existingVideo.duration;

    if (videoFile) {
        const uploadedVideo = await uploadFromBuffer(videoFile.buffer, 'videos', 'video');
        video_url = uploadedVideo.secure_url;
        function secondsToHMS(seconds) {
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
        duration = secondsToHMS(uploadedVideo.duration);
    }

    if (thumbnailFile) {
        const uploadedThumbnail = await uploadFromBuffer(thumbnailFile.buffer, 'thumbnails', 'image');
        thumbnail_url = uploadedThumbnail.secure_url;
    }

    const updatedVideo = await prisma.video.update({
        where: { id },
        data: {
            title,
            description,
            duration,
            video_url,
            thumbnail_url,
            category_id: category_id ? parseInt(category_id) : null,
            updated: new Date()
        }
    });

    return updatedVideo;
};

const deleteVideo = async (id) => {
    const existingVideo = await getVideoById(id);

    await deleteFromCloudinary(existingVideo.video_url);
    await deleteFromCloudinary(existingVideo.thumbnail_url);

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