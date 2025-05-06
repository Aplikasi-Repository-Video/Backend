require('dotenv').config();
const elasticClient = require('./utils/elasticClient');

const createVideoIndex = async () => {
    try {
        const indexExists = await elasticClient.indices.exists({ index: 'videos' });
        if (!indexExists) {
            await elasticClient.indices.create({
                index: 'videos',
                body: {
                    mappings: {
                        properties: {
                            id: { type: 'integer' },
                            searchable: {
                                type: 'text',
                                analyzer: 'standard'
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error creating index:', error);
    }
};

createVideoIndex();