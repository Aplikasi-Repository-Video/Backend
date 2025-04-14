const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

exports = deleteFromCloudinary = async (url) => {
    if (!url) return;

    const publicId = url.split('/').pop().split('.')[0];

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
    }
}

module.exports = cloudinary
