const prisma = require('../prisma/client');
const { elasticClient } = require('../utils/elasticClient');

const searchInElasticSearch = async (query) => {
  try {
    const result = await elasticClient.search({
      index: 'videos',
      body: {
        query: {
          match: {
            searchable: {
              query: query,
              fuzziness: 'AUTO'
            }
          }
        }
      }
    });

    if (!result || !result.hits || !result.hits.hits) {
      throw new Error('Tidak ada hasil yang ditemukan dari pencarian Elasticsearch');
    }

    return result.hits.hits.map(hit => ({
      id: hit._source.id,
      score: hit._score
    }));
  } catch (error) {
    console.error('Error saat mencari di Elasticsearch:', error.message);
    throw error;
  }
};

const searchVideos = async (query) => {
  try {
    const searchHits = await searchInElasticSearch(query);
    const ids = searchHits.map(hit => hit.id);

    const videos = await prisma.video.findMany({
      where: { id: { in: ids } },
      include: {
        _count: { select: { Like: true, Comment: true } }
      }
    });

    const videoMap = videos.reduce((map, video) => {
      map[video.id] = video;
      return map;
    }, {});

    const results = searchHits
      .map(hit => ({ ...videoMap[hit.id], score: hit.score }))
      .filter(Boolean);

    return results;

  } catch (error) {
    console.error('Gagal mencari video:', error.message);
    return [];
  }
};

module.exports = { searchVideos };
