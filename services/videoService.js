const prisma = require('../prisma/client');
const { deleteFromCloudinary } = require('../utils/cloudinary');
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
            Comment: {
                include: {
                    User: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
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

const createVideo = async ({ title, description, category_id, user_id, video_url, thumbnail_url, duration }) => {
    try {
        const now = new Date();

        const newVideo = await prisma.video.create({
            data: {
                title,
                description,
                searchable: `${title} ${description}`,
                duration: duration ?? 0, // default jika tidak ada durasi
                video_url,
                thumbnail_url,
                category_id: category_id ? parseInt(category_id) : null,
                user_id: parseInt(user_id),
                created: now,
                updated: now,
            },
        });

        // Sinkronisasi ke Elasticsearch
        try {
            await syncVideoIndex(newVideo);
        } catch (syncErr) {
            console.warn('Gagal sync Elasticsearch:', syncErr?.message || syncErr);
            // optional: bisa log ke monitoring service di sini
        }

        return newVideo;

    } catch (error) {
        console.error('Gagal membuat video:', error?.message || error);
        throw new Error('Gagal menyimpan video, perubahan dibatalkan');
    }
};


const updateVideo = async (
    id,
    { title, description, category_id, new_video_url, new_thumbnail_url, new_duration }
) => {
    try {
        const existingVideo = await getVideoById(id);
        if (!existingVideo) {
            throw new Error('Video tidak ditemukan');
        }

        const shouldDeleteVideo = new_video_url && new_video_url !== existingVideo.video_url;
        const shouldDeleteThumbnail = new_thumbnail_url && new_thumbnail_url !== existingVideo.thumbnail_url;

        const deletions = [];
        if (shouldDeleteVideo) deletions.push(deleteFromCloudinary(existingVideo.video_url));
        if (shouldDeleteThumbnail) deletions.push(deleteFromCloudinary(existingVideo.thumbnail_url));

        if (deletions.length > 0) {
            const deletionResults = await Promise.allSettled(deletions);
            deletionResults.forEach((res, idx) => {
                if (res.status === 'rejected') {
                    const jenis = idx === 0 && shouldDeleteVideo ? 'video' : 'thumbnail';
                    console.warn(`Gagal hapus ${jenis} lama dari Cloudinary:`, res.reason?.message || res.reason);
                }
            });
        }

        const video_url = new_video_url ?? existingVideo.video_url;
        const thumbnail_url = new_thumbnail_url ?? existingVideo.thumbnail_url;
        const duration = new_duration ?? existingVideo.duration;
        const finalTitle = title ?? existingVideo.title;
        const finalDescription = description ?? existingVideo.description;

        const updatedVideo = await prisma.video.update({
            where: { id },
            data: {
                title: finalTitle,
                description: finalDescription,
                searchable: `${finalTitle} ${finalDescription}`,
                duration,
                video_url,
                thumbnail_url,
                category_id: category_id ? parseInt(category_id) : null,
                updated: new Date(),
            },
        });

        try {
            await syncVideoIndex(updatedVideo);
        } catch (syncErr) {
            console.warn('Gagal sync Elasticsearch (update):', syncErr?.message || syncErr);
        }

        return updatedVideo;

    } catch (err) {
        console.error('Gagal update video:', err?.message || err);
        throw new Error('Update video gagal');
    }
};

const deleteVideo = async (id) => {
    try {
        const existingVideo = await getVideoById(id);
        if (!existingVideo) {
            throw new Error('Video tidak ditemukan');
        }

        const [cloudVideo, cloudThumb] = await Promise.allSettled([
            deleteFromCloudinary(existingVideo.video_url),
            deleteFromCloudinary(existingVideo.thumbnail_url),
        ]);

        if (cloudVideo.status === 'rejected') {
            console.warn('Gagal hapus video dari Cloudinary:', cloudVideo.reason?.message || cloudVideo.reason);
        }
        if (cloudThumb.status === 'rejected') {
            console.warn('Gagal hapus thumbnail dari Cloudinary:', cloudThumb.reason?.message || cloudThumb.reason);
        }

        try {
            await deleteVideoIndex(id);
        } catch (syncErr) {
            console.warn('Gagal hapus index Elasticsearch:', syncErr?.message || syncErr);
        }

        const deleted = await prisma.video.delete({ where: { id } });
        return deleted;

    } catch (err) {
        console.error('Gagal menghapus video:', err?.message || err);
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
