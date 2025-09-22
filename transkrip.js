const cloudinary = require('cloudinary').v2;
const config = require('./config/cloudinaryConfig');

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});
const getUrl = async (publicId, resourceType) => {
    try {
        const resource = await cloudinary.api.resource(publicId, { resource_type: resourceType });
        return resource.secure_url;
    } catch (error) {
        throw error;
    }
};

getUrl('videos/152bdbf6-4d26-4abb-b7e5-d7aefbe040a7.transcript', 'raw')
    .then(url => console.log('File URL:', url))
    .catch(err => console.error('Error fetching URL:', err));
