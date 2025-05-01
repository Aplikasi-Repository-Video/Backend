const watchHistoryService = require('../services/watchHistoryService');
const { validateWatchHistory, validateWatchHistoryId, validateWatchHistoryUserId, validateWatchHistoryDurationWatch } = require('../validations/watchHistoryValidation')

const createWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistory(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const watchHistory = await watchHistoryService.createWatchHistory(req.body)
        res.status(201).json({
            success: true,
            message: 'Berhasil membuat riwayat',
            data: watchHistory
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat riwayat',
            error: error.message
        })
    }
};

const getAllWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistoryUserId(req.query);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const watchHistory = await watchHistoryService.getAllWatchHistory(req.query);
        res.status(200).json({
            success: true,
            message: 'Berhasil mendapatkan riwayat',
            data: watchHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mendapatkan riwayat',
            error: error.message
        });
    }
};

const updateWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistoryId(req.params);
        const { error: errorDurationWatch } = validateWatchHistoryDurationWatch(req.body);

        if (error || errorDurationWatch) {
            return res.status(400).json({
                success: false,
                message: {
                    ...(error && { params: error.message }),
                    ...(errorDurationWatch && { body: errorDurationWatch.message })
                }
            });
        }

        const watchHistory = await watchHistoryService.updateWatchHistory(+req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Berhasil memperbarui riwayat',
            data: watchHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui riwayat',
            error: error.message
        });
    }
}

const deleteWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistoryId(req.params);
        if (error) return res.status(400).json({
            success: false,
            message: error.message
        });

        const watchHistory = await watchHistoryService.deleteWatchHistory(+req.params.id);
        res.status(200).json({
            success: true,
            message: 'Berhasil menghapus riwayat',
            data: watchHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus riwayat',
            error: error.message
        });
    }
}

module.exports = {
    createWatchHistory,
    getAllWatchHistory,
    updateWatchHistory,
    deleteWatchHistory
}