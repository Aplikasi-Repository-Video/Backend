const prisma = require('../prisma/client');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const { syncVideoIndex, deleteVideoIndex } = require('../utils/elasticHelpers');
const { v4: uuidv4 } = require('uuid');
const { prepareTranscriptForIndex } = require('../utils/transcriptHelpers');
const config = require('../config/cloudinaryConfig');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});

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

const initializePendingVideo = async ({ title, description, category_id, user_id, thumbnail_url }) => {
    try {
        const public_id = uuidv4();
        await prisma.video.create({
            data: {
                public_id,
                title,
                description,
                thumbnail_url,
                category_id: category_id ? parseInt(category_id) : null,
                user_id: parseInt(user_id),
                status: 'PENDING',
                created: new Date(),
                updated: new Date(),
            },
        });
        return public_id;
    } catch (error) {
        throw new Error('Gagal memulai proses upload video');
    }
};

const finalizeVideoFromWebhook = async (webhookBody) => {
    try {
        const { public_id, secure_url, duration, context, notification_type, info_status } = webhookBody;
        if (!public_id) throw new Error("Public ID tidak ditemukan di webhook");

        const cleanPublicId = public_id.split("/").pop();

        if (notification_type === "upload") {
            const video = await prisma.video.update({
                where: { public_id: cleanPublicId },
                data: {
                    video_url: secure_url,
                    duration: duration ? Math.round(duration) : null,
                    status: "PROCESSING",
                    updated: new Date(),
                },
            });

            return video;
        }

        if (notification_type === "info" && info_status === "pending") {
            return null;
        }

        let transcriptText = "";
        let transcriptDoc = null;

        if (notification_type === "info" && info_status === "complete") {
            try {
                const existingVideo = await prisma.video.findUnique({
                    where: { public_id: cleanPublicId },
                    select: {
                        title: true,
                        description: true,
                        Category: { select: { name: true } },
                    },
                });

                transcriptDoc = await prepareTranscriptForIndex(public_id, {
                    video_id: existingVideo?.id,
                    public_id: cleanPublicId,
                    title: existingVideo?.title,
                    description: existingVideo?.description,
                    category: existingVideo?.Category?.name || "",
                });

                transcriptText = transcriptDoc?.full_transcript || "";
            } catch (err) {
                console.error(`❌ Gagal ambil transcript dari Cloudinary (public_id: ${public_id}):`, err.message);
            }
        }

        const searchableText = `${transcriptDoc?.title || ''} ${transcriptDoc?.description || ''} ${transcriptDoc?.category || ''} ${transcriptText}`.trim();
        const updatedVideo = await prisma.video.update({
            where: { public_id: cleanPublicId },
            data: {
                status: transcriptText ? "COMPLETED" : "PROCESSING",
                transcript: transcriptText,
                updated: new Date(),
            },
        });

        if (transcriptDoc) {
            await syncVideoIndex(transcriptDoc);
            console.log(`📤 Video ${public_id} siap diindex ke Elasticsearch`);
        }

        return updatedVideo;
    } catch (error) {
        console.error(`❌ Gagal finalisasi video dari webhook (public_id: ${webhookBody.public_id}):`, error.message);

        try {
            await prisma.video.update({
                where: { public_id: webhookBody.public_id.split("/").pop() },
                data: { status: "FAILED" },
            });
        } catch (dbErr) {
            console.error(`⚠️ Gagal set status FAILED di DB:`, dbErr.message);
        }

        throw error;
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
                duration,
                video_url,
                thumbnail_url,
                category_id: category_id ? parseInt(category_id) : null,
                updated: new Date(),
            },
        });

        try {
            // await syncVideoIndex(updatedVideo);
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
            // await deleteVideoIndex(id);
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
    initializePendingVideo,
    finalizeVideoFromWebhook,
    getVideoById,
    getVideosByCategory,
    // createVideo,
    updateVideo,
    deleteVideo
};

// const createVideo = async ({ title, description, category_id, user_id, video_url, thumbnail_url, duration }) => {
//     try {
//         const now = new Date();

//         const newVideo = await prisma.video.create({
//             data: {
//                 title,
//                 description,
//                 searchable: `${title} ${description}`,
//                 duration: duration ?? 0, // default jika tidak ada durasi
//                 video_url,
//                 thumbnail_url,
//                 category_id: category_id ? parseInt(category_id) : null,
//                 user_id: parseInt(user_id),
//                 created: now,
//                 updated: now,
//             },
//         });

//         // Sinkronisasi ke Elasticsearch
//         try {
//             await syncVideoIndex(newVideo);
//         } catch (syncErr) {
//             console.warn('Gagal sync Elasticsearch:', syncErr?.message || syncErr);
//             // optional: bisa log ke monitoring service di sini
//         }

//         return newVideo;

//     } catch (error) {
//         console.error('Gagal membuat video:', error?.message || error);
//         throw new Error('Gagal menyimpan video, perubahan dibatalkan');
//     }
// };
