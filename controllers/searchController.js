const { searchVideos } = require('../services/searchService');
const { searchValidationSchema } = require('../validations/searchValidation'); // Import validasi


const searchController = async (req, res) => {
    const { error } = searchValidationSchema.validate(req.query);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    try {
        const { keyword } = req.query;
        const videos = await searchVideos(keyword);

        return res.status(200).json({
            success: true,
            message: 'Berhasil melakukan pencarian.',
            data: videos,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat melakukan pencarian.',
            error: err.message,
        });
    }
};

module.exports = {
    searchController,
};
