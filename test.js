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

    if (!indexExists) {
        await elasticClient.indices.create({
            index: 'videos',
            body: {
                mappings: {
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'text' },
                        description: { type: 'text' },
                        searchable: { type: 'text' },
                    },
                },
            },
        });
        console.log('Index "videos" dibuat');
    } else {
        console.log('Index "videos" sudah ada');
    }
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
                searchable: `${video.title} ${video.description}`,
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
