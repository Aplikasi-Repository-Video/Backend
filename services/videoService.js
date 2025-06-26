const prisma = require('../prisma/client');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs/promises');
const uploadFromPath = require('../utils/uploadFromPath');
const { syncVideoIndex, deleteVideoIndex } = require('../utils/elasticHelpers');

const getAllVideos = async () => {
    return await prisma.video.findMany({
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
};

const getVideoById = async (id) => {
    const video = await prisma.video.findUnique({
        where: { id },
        include: {
            Comment: true,
            Like: true
        }
    });

    if (!video) throw new Error('Video tidak ditemukan');
    return video;
};

const getVideosByCategory = async (id) => {
    return await prisma.video.findMany({
        where: { category_id: id },
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
};

const createVideo = async ({ title, description, category_id, user_id, videoFile, thumbnailFile }) => {
    let uploadedVideo = null;
    let uploadedThumbnail = null;

    try {
        uploadedVideo = await uploadFromPath(videoFile.path, 'videos', 'video');
        uploadedThumbnail = await uploadFromPath(thumbnailFile.path, 'thumbnails', 'image');

        await Promise.allSettled([
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

        try {
            await syncVideoIndex(newVideo);
        } catch (syncErr) {
            console.warn('Gagal sync Elasticsearch:', syncErr);
        }

        return newVideo;

    } catch (error) {
        console.error('Gagal membuat video:', error);

        await Promise.allSettled([
            uploadedVideo?.secure_url && deleteFromCloudinary(uploadedVideo.secure_url),
            uploadedThumbnail?.secure_url && deleteFromCloudinary(uploadedThumbnail.secure_url),
            fs.unlink(videoFile.path).catch(() => { }),
            fs.unlink(thumbnailFile.path).catch(() => { })
        ]);

        throw new Error('Gagal menyimpan video, perubahan dibatalkan');
    }
};

const updateVideo = async (id, { title, description, category_id, videoFile, thumbnailFile }) => {
    const existingVideo = await getVideoById(id);
    let video_url = existingVideo.video_url;
    let thumbnail_url = existingVideo.thumbnail_url;
    let duration = existingVideo.duration;

    try {
        if (videoFile) {
            const uploaded = await uploadFromPath(videoFile.path, 'videos', 'video');
            await Promise.allSettled([
                deleteFromCloudinary(existingVideo.video_url),
                fs.unlink(videoFile.path)
            ]);
            video_url = uploaded.secure_url;
            duration = uploaded.duration;
        }

        if (thumbnailFile) {
            const uploaded = await uploadFromPath(thumbnailFile.path, 'thumbnails', 'image');
            await Promise.allSettled([
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

        try {
            await syncVideoIndex(updatedVideo);
        } catch (syncErr) {
            console.warn('Gagal sync Elasticsearch (update):', syncErr);
        }

        return updatedVideo;

    } catch (err) {
        console.error('Gagal update video:', err);
        throw new Error('Update video gagal');
    }
};

const deleteVideo = async (id) => {
    const existingVideo = await getVideoById(id);

    try {
        const [cloudVideo, cloudThumb] = await Promise.allSettled([
            deleteFromCloudinary(existingVideo.video_url),
            deleteFromCloudinary(existingVideo.thumbnail_url)
        ]);

        if (cloudVideo.status === 'rejected') {
            console.warn('Gagal hapus video cloud:', cloudVideo.reason);
        }
        if (cloudThumb.status === 'rejected') {
            console.warn('Gagal hapus thumbnail cloud:', cloudThumb.reason);
        }

        try {
            await deleteVideoIndex(id);
        } catch (syncErr) {
            console.warn('Gagal hapus index Elasticsearch:', syncErr);
        }

        return await prisma.video.delete({ where: { id } });

    } catch (err) {
        console.error('Gagal hapus video:', err);
        throw new Error('Gagal menghapus video');
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    getVideosByCategory,
    createVideo,
    updateVideo,
    deleteVideo
};
