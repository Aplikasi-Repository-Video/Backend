const { elasticClient } = require('./elasticClient');

const normalizeText = (text) =>
    text
        ?.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim();

const syncVideoIndex = async (video) => {
    try {
        const searchable = normalizeText(`${video.title} ${video.description}`);

        await elasticClient.index({
            index: 'videos',
            id: video.id,
            body: {
                id: video.id,
                title: video.title,
                description: video.description,
                searchable,
            },
        });
    } catch (error) {
        console.error('Elasticsearch sync error:', error.message);
    }
};

const deleteVideoIndex = async (id) => {
    try {
        await elasticClient.delete({
            index: 'videos',
            id: id,
        });
    } catch (error) {
        if (error.meta && error.meta.statusCode === 404) {
            console.warn('Index not found for deletion:', id);
        } else {
            console.error('Elasticsearch delete error:', error.message);
        }
    }
};

module.exports = { syncVideoIndex, deleteVideoIndex };
