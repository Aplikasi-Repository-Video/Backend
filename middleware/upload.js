// const multer = require('multer');

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         const error = new Error('Format file tidak didukung. Hanya jpg, jpeg, png, dan mp4 yang diperbolehkan.');
//         cb(error, false);
//     }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder upload ada
const uploadPath = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = {
        video: ['video/mp4', 'video/mpeg'],
        thumbnail: ['image/jpeg', 'image/png']
    };

    if (file.fieldname === 'video' && allowedMimeTypes.video.includes(file.mimetype)) {
        cb(null, true);
    } else if (file.fieldname === 'thumbnail' && allowedMimeTypes.thumbnail.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed for ${file.fieldname}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // max 50MB
    }
});

module.exports = upload;


