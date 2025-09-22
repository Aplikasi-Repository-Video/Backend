const cloudinary = require('cloudinary').v2;
const config = require('../config/cloudinaryConfig');

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});

const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) return;

    const parts = fileUrl.split('/upload/');
    if (parts.length < 2) return;

    const pathWithExtension = parts[1].replace(/^v\d+\//, '');
    const publicId = pathWithExtension.replace(/\.[^/.]+$/, '');

    const isVideo = fileUrl.includes('/video/');
    const resourceType = isVideo ? 'video' : 'image';

    try {
        console.log('[Cloudinary] Public ID to delete:', publicId);
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        console.log(`[Cloudinary] File ${publicId} deleted, result:`, result);
    } catch (error) {
        console.error('[Cloudinary] Gagal menghapus file:', error);
    }
};

const generateUploadSignature = (body) => {
    const { type = 'image', ...metadata } = body;
    const timestamp = Math.round((new Date()).getTime() / 1000);
    let params_to_sign = { timestamp };

    if (type === 'video') {
        const { title, description, category_id, user_id, thumbnail_url, public_id } = metadata;

        if (!title || !user_id || !thumbnail_url || !public_id) {
            const error = new Error('Data tidak lengkap untuk signature video.');
            error.statusCode = 400;
            throw error;
        }

        const context = `title=${title}|description=${description || ''}|category_id=${category_id || ''}|user_id=${user_id}|thumbnail_url=${thumbnail_url}`;

        params_to_sign = {
            ...params_to_sign,
            public_id,
            folder: config.video_folder,
            context: context,
            raw_convert: config.transcription_service,
            notification_url: `${process.env.BACKEND_URL}/api/cloudinary/webhook`,
        };

    } else {
        params_to_sign.folder = config.thumbnail_folder;
    }

    const signature = cloudinary.utils.api_sign_request(params_to_sign, cloudinary.config().api_secret);

    return {
        signature,
        timestamp,
        params: params_to_sign,
        api_key: cloudinary.config().api_key,
    };
}

module.exports = {
    cloudinary,
    deleteFromCloudinary,
    generateUploadSignature,
};
