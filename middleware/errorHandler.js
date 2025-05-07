// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Menangani error terkait dengan koneksi database
    if (err.message.includes("Can't reach database server")) {
        return res.status(500).json({
            success: false,
            message: 'Gagal menghubungi server database. Silakan coba beberapa saat lagi atau hubungi administrator.',
        });
    }

    // Menangani error ketika mencoba menghapus data yang tidak ada
    if (err.message.includes("Record to delete does not exist")) {
        return res.status(404).json({
            success: false,
            message: 'Data yang ingin dihapus tidak ditemukan.',
        });
    }

    // Menangani error Prisma lainnya
    if (err.message.includes("delete()` invocation")) {
        return res.status(400).json({
            success: false,
            message: 'Operasi gagal. Pastikan data yang ingin dihapus ada dan valid.',
        });
    }

    if (err.message.includes("findMany()` invocation in")) {
        return res.status(400).json({
            success: false,
            message: 'Operasi gagal. Pastikan data yang ingin diambil ada dan valid.',
        });
    }

    if (err.message.includes("findUnique()` invocation in")) {
        return res.status(400).json({
            success: false,
            message: 'Operasi gagal. Pastikan data yang ingin diambil ada dan valid.',
        });
    }

    // Error umum lainnya
    return res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan tak terduga.',
    });
};

module.exports = errorHandler;
