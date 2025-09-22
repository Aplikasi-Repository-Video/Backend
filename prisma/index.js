const { Client } = require('@elastic/elasticsearch');
const prisma = require('./client');
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
    const indexExists = await elasticClient.indices.exists({ index: 'eduvid-index' });
    console.log('Cek keberadaan index "eduvid-index":', indexExists);

    if (indexExists) {
        console.log('Index "eduvid-index" sudah ada, menghapus...');
        await elasticClient.indices.delete({ index: 'eduvid-index' });
        console.log('Index "eduvid-index" berhasil dihapus.');
    }

    await elasticClient.indices.create({
        index: 'eduvid-index',
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
                    category: { type: 'keyword' },
                    transcript: { type: 'text' },
                    searchable: {
                        type: 'text',
                        analyzer: 'custom_search_analyzer',
                    },
                    words: {
                        type: 'nested', // penting untuk array objek
                        properties: {
                            word: { type: 'text' },
                            start_time: { type: 'float' },
                            end_time: { type: 'float' },
                        },
                    },
                },
            },
        },
    });

    console.log('Index "eduvid-index" berhasil dibuat dengan custom analyzer dan field words');
};

const indexAllVideos = async () => {
    try {
        await createVideoIndex();

        const videos = await prisma.video.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                transcript: true,
                Category: {
                    select: { name: true }
                },
            },
        });

        const body = videos.flatMap((video) => [
            { index: { _index: 'eduvid-index', _id: video.id } },
            {
                id: video.id,
                title: video.title,
                description: video.description,
                category: video.Category?.name || "",
                transcript: video.transcript || "",
                words: video.words || [],
                searchable: `${video.title || ""} ${video.Category?.name || ""} ${video.description || ""} ${video.transcript || ""}`.toLowerCase(),
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
