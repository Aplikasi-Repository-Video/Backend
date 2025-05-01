const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) return;

    // Ekstrak bagian setelah '/upload/' lalu hapus ekstensi
    const parts = fileUrl.split('/upload/');
    if (parts.length < 2) return;

    const pathWithExtension = parts[1].replace(/^v\d+\//, ''); // remove version prefix
    const publicId = pathWithExtension.split('.')[0]; // remove file extension

    const isVideo = fileUrl.includes('/video/');
    const resourceType = isVideo ? 'video' : 'image';

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        console.log(`[Cloudinary] File ${publicId} deleted, result:`, result);
    } catch (error) {
        console.error('[Cloudinary] Gagal menghapus file:', error);
    }
};

module.exports = {
    cloudinary,
    deleteFromCloudinary
}
