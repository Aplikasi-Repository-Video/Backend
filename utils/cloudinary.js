const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
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

// const extractPublicId = (fileUrl) => {
//     if (!fileUrl) return null;

//     const parts = fileUrl.split('/upload/');
//     if (parts.length < 2) return null;

//     const pathWithExtension = parts[1].replace(/^v\d+\//, '');
//     return decodeURIComponent(pathWithExtension.replace(/\.[^/.]+$/, ''));
// };

// const getTranscription = async (fileUrl) => {
//     try {
//         const publicId = extractPublicId(fileUrl);
//         if (!publicId) return null;

//         const result = await cloudinary.uploader.upload("lincoln.mp4", {
//             resource_type: "video",
//             raw_convert: "google_speech"
//         });

//         console.log("[Upload Result]", JSON.stringify(result, null, 2));


//         return result?.info?.transcription?.google_speech || null;
//     } catch (err) {
//         console.error('[Cloudinary] Gagal transkripsi:', err?.message || err);
//         return null;
//     }
// };

module.exports = {
    cloudinary,
    deleteFromCloudinary,
    // getTranscription
};
