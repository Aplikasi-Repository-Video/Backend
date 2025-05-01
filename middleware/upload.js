const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createFolderIfNotExist = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';
        if (file.fieldname === 'video') {
            folder = 'uploads/videos/';
        } else if (file.fieldname === 'thumbnail') {
            folder = 'uploads/thumbnails/';
        }
        createFolderIfNotExist(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

// Validasi jenis file
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video') {
        if (file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Hanya file MP4 yang diperbolehkan untuk video'), false);
        }
    } else if (file.fieldname === 'thumbnail') {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Thumbnail harus PNG, JPG, atau JPEG'), false);
        }
    } else {
        cb(new Error('Field tidak dikenali'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2000 * 1024 * 1024 // 200MB max per file, sesuaikan kebutuhan
    }
});

module.exports = upload;
