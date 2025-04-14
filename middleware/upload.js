const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/quicktime', 'video/webm'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Format file tidak didukung. Hanya jpg, jpeg, png, dan mp4 yang diperbolehkan.');
        cb(error, false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

