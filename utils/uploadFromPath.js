const { cloudinary } = require('./cloudinary');

const uploadFromPath = async (filePath, folder, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: resourceType,
            chunk_size: resourceType === 'video' ? 6 * 1024 * 1024 : undefined
        });
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = uploadFromPath;
