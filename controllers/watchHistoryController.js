const watchHistoryService = require('../services/watchHistoryService');
const { validateWatchHistory, validateWatchHistoryId, validateWatchHistoryUserId } = require('../validations/watchHistoryValidation')

const createWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistory(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const watchHistory = await watchHistoryService.createWatchHistory(req.body)
        res.status(201).json(watchHistory)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const getAllWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistoryUserId(req.query);
        if (error) return res.status(400).json({ error: error.message });

        const watchHistory = await watchHistoryService.getAllWatchHistory(req.query);
        res.status(200).json(watchHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistoryId(req.params);
        if (error) return res.status(400).json({ error: error.message });

        const watchHistory = await watchHistoryService.updateWatchHistory(+req.params.id, req.body);
        res.status(200).json(watchHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteWatchHistory = async (req, res) => {
    try {
        const { error } = validateWatchHistoryId(req.params);
        if (error) return res.status(400).json({ error: error.message });

        const watchHistory = await watchHistoryService.deleteWatchHistory(+req.params.id);
        res.status(200).json(watchHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createWatchHistory,
    getAllWatchHistory,
    updateWatchHistory,
    deleteWatchHistory
}