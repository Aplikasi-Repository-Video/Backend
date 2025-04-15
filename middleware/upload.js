const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/mkv', 'video/webm', 'videp/mpeg'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Format file tidak didukung. Hanya ', allowedTypes.join(', '));
        cb(error, false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

