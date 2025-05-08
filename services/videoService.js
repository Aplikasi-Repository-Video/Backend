const prisma = require('../prisma/client');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs/promises');
const uploadFromPath = require('../utils/uploadFromPath');
const { syncVideoIndex, deleteVideoIndex } = require('../utils/elasticHelpers');


const getAllVideos = async () => {
    const videos = await prisma.video.findMany({
        include: {
            _count: {
                select: {
                    Like: true,
                    Comment: true
                }
            }
        },
        orderBy: {
            Like: {
                _count: 'desc'
            }
        }
    });

    return videos;
};


const getVideoById = async (id) => {
    const video = await prisma.video.findUnique({
        where: {
            id: id
        },
        include: {
            Comment: true,
            Like: true
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

    await Promise.all([
        fs.unlink(videoFile.path),
        fs.unlink(thumbnailFile.path)
    ]);

    const now = new Date();

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
            created: now,
            updated: now
        }
    });

    await syncVideoIndex(newVideo);

    return newVideo;
};


const updateVideo = async (id, { title, description, category_id, videoFile, thumbnailFile }) => {
    const existingVideo = await getVideoById(id);

    let video_url = existingVideo.video_url;
    let thumbnail_url = existingVideo.thumbnail_url;
    let duration = existingVideo.duration;

    if (videoFile) {
        const uploaded = await uploadFromPath(videoFile.path, 'videos', 'video');
        await Promise.all([
            deleteFromCloudinary(existingVideo.video_url),
            fs.unlink(videoFile.path)
        ]);
        video_url = uploaded.secure_url;
        duration = uploaded.duration;
    }

    if (thumbnailFile) {
        const uploaded = await uploadFromPath(thumbnailFile.path, 'thumbnails', 'image');
        await Promise.all([
            deleteFromCloudinary(existingVideo.thumbnail_url),
            fs.unlink(thumbnailFile.path)
        ]);
        thumbnail_url = uploaded.secure_url;
    }

    const updatedVideo = await prisma.video.update({
        where: { id },
        data: {
            title: title || existingVideo.title,
            description: description || existingVideo.description,
            searchable: `${title || existingVideo.title} ${description || existingVideo.description}`,
            duration,
            video_url,
            thumbnail_url,
            category_id: category_id ? parseInt(category_id) : null,
            updated: new Date()
        }
    });

    await syncVideoIndex(updatedVideo);
    return updatedVideo;
};


const deleteVideo = async (id) => {
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
        throw new Error('Video tidak ditemukan');
    }

    try {
        const [videoResult, thumbnailResult] = await Promise.allSettled([
            deleteFromCloudinary(existingVideo.video_url),
            deleteFromCloudinary(existingVideo.thumbnail_url)
        ]);

        if (videoResult.status === 'rejected') {
            console.warn(`Gagal menghapus video dari cloudinary: ${videoResult.reason}`);
        }
        if (thumbnailResult.status === 'rejected') {
            console.warn(`Gagal menghapus thumbnail dari cloudinary: ${thumbnailResult.reason}`);
        }

        await deleteVideoIndex(id);

        return await prisma.video.delete({ where: { id } });

    } catch (error) {
        throw new Error('Gagal menghapus video dari database: ' + error.message);
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
};