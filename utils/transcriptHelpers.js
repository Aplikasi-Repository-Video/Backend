const axios = require("axios");
const config = require('../config/cloudinaryConfig');

async function prepareTranscriptForIndex(public_id, videoMeta) {
    try {
        console.log(`videoMeta:`, videoMeta);
        const transcriptUrl = `https://res.cloudinary.com/${config.cloud_name}/raw/upload/${public_id}.transcript`;

        console.log(`🔍 Fetch transcript dari: ${transcriptUrl}`);
        const res = await axios.get(transcriptUrl);
        const transcriptArray = res.data;

        const fullTranscript = transcriptArray
            .map((item) => item.transcript.trim())
            .join(" ");

        const words = transcriptArray.flatMap((item) =>
            item.words.map((w) => ({
                word: w.word,
                start_time: w.start_time,
                end_time: w.end_time,
            }))
        );

        const doc = {
            id: videoMeta.video_id || null,
            title: videoMeta.title || "",
            description: videoMeta.description || "",
            category: videoMeta.category || "",
            full_transcript: fullTranscript,
            words,
        };

        return doc;
    } catch (err) {
        console.error(`❌ Gagal ambil transkrip untuk ${public_id}:`, err.message);
        return null;
    }
}

module.exports = { prepareTranscriptForIndex };
