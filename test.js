const { Client } = require('@elastic/elasticsearch');
const prisma = require('./prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        apiKey: process.env.ELASTIC_API_KEY,
    },
});

const createVideoIndex = async () => {
    const indexExists = await elasticClient.indices.exists({ index: 'videos' });

    if (indexExists) {
        console.log('Index "videos" sudah ada, menghapus...');
        await elasticClient.indices.delete({ index: 'videos' });
        console.log('Index "videos" berhasil dihapus.');
    }

    await elasticClient.indices.create({
        index: 'videos',
        body: {
            settings: {
                analysis: {
                    analyzer: {
                        custom_search_analyzer: {
                            type: 'custom',
                            tokenizer: 'standard',
                            filter: ['lowercase', 'asciifolding'],
                        },
                    },
                },
            },
            mappings: {
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'text' },
                    description: { type: 'text' },
                    searchable: {
                        type: 'text',
                        analyzer: 'custom_search_analyzer',
                    },
                },
            },
        },
    });

    console.log('Index "videos" berhasil dibuat dengan custom analyzer');
};

const indexAllVideos = async () => {
    try {
        await createVideoIndex();

        const videos = await prisma.video.findMany({
            select: {
                id: true,
                title: true,
                description: true,
            },
        });

        const body = videos.flatMap((video) => [
            { index: { _index: 'videos', _id: video.id } },
            {
                id: video.id,
                title: video.title,
                description: video.description,
                searchable: `${video.title} ${video.description}`.toLowerCase(), // optional normalize
            },
        ]);

        const bulkResponse = await elasticClient.bulk({ refresh: true, body });

        if (bulkResponse.errors) {
            console.error('Gagal mengindeks sebagian dokumen:', bulkResponse);
        } else {
            console.log(`${videos.length} video berhasil diindeks ke Elasticsearch.`);
        }
    } catch (err) {
        console.error('Error saat mengindeks:', err);
    } finally {
        await elasticClient.close();
    }
};

indexAllVideos();
