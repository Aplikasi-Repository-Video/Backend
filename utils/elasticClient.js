const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        apiKey: process.env.ELASTIC_API_KEY,
    },
});


module.exports = {
    elasticClient,
};
