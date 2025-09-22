require('dotenv').config();

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

    video_folder: process.env.CLOUDINARY_VIDEO_FOLDER || 'videos',
    thumbnail_folder: process.env.CLOUDINARY_THUMBNAIL_FOLDER || 'thumbnails',
    transcript_folder: process.env.CLOUDINARY_TRANSCRIPT_FOLDER || 'transcripts',
    transcription_service: process.env.CLOUDINARY_TRANSCRIPTION_SERVICE || '',
};

module.exports = cloudinaryConfig;