const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs/promises');
const path = require('path');
const uploadFromPath = require('../utils/uploadFromPath');
const { vi } = require('@faker-js/faker');



const getAllVideos = async () => {
    return await prisma.video.findMany({
        take: 10
    });
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

const createVideo = async ({ title, description, category_id, user_id, videoFile, thumbnailFile }) => {
    const uploadedVideo = await uploadFromPath(videoFile.path, 'videos', 'video');
    const uploadedThumbnail = await uploadFromPath(thumbnailFile.path, 'thumbnails', 'image');

    await fs.unlink(videoFile.path);
    await fs.unlink(thumbnailFile.path);

    const newVideo = await prisma.video.create({
        data: {
            title,
            description,
            searchable: `${title} ${description}`,
            duration: uploadedVideo.duration,
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
        const uploadedVideo = await uploadFromPath(videoFile.path, 'videos', 'video');
        await deleteFromCloudinary(existingVideo.video_url);
        video_url = uploadedVideo.secure_url;
        duration = uploadedVideo.duration;

        await fs.unlink(videoFile?.path);
    }

    if (thumbnailFile) {
        const uploadedThumbnail = await uploadFromPath(thumbnailFile.path, 'thumbnails', 'image');
        await deleteFromCloudinary(existingVideo.thumbnail_url);
        thumbnail_url = uploadedThumbnail.secure_url;

        await fs.unlink(thumbnailFile?.path);
    }

    const updatedVideo = await prisma.video.update({
        where: { id },
        data: {
            title,
            description,
            searchable: `${title} ${description}`,
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
    if (!existingVideo) {
        throw new Error('Video tidak ditemukan');
    }

    try {
        const deleteVideoPromise = deleteFromCloudinary(existingVideo.video_url);
        const deleteThumbnailPromise = deleteFromCloudinary(existingVideo.thumbnail_url);

        await Promise.allSettled([deleteVideoPromise, deleteThumbnailPromise]);

        return await prisma.video.delete({
            where: { id }
        });
    } catch (error) {
        throw new Error('Gagal menghapus video: ' + error.message);
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
};