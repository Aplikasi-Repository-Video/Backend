const cloudinaryService = require('../services/cloudinaryService');
const videoService = require('../services/videoService');

const handleGenerateSignature = async (req, res) => {
    const { type = 'image' } = req.body;

    try {
        if (type === 'image') {
            const signatureData = cloudinaryService.generateUploadSignature(req.body);
            console.log('[Signature Controller] Generated image signature:', signatureData);
            return res.status(200).json({
                success: true,
                message: 'Signature thumbnail berhasil dibuat',
                signature: signatureData
            });
        }

        if (type === 'video') {
            const { title, description, category_id, user_id, thumbnail_url } = req.body;

            const public_id = await videoService.initializePendingVideo({
                title,
                description,
                category_id,
                user_id,
                thumbnail_url,
            });

            const signatureData = cloudinaryService.generateUploadSignature({
                ...req.body,
                public_id: public_id,
            });

            console.log('[Signature Controller] Generated video signature:', signatureData);

            return res.status(200).json({
                success: true,
                message: 'Signature video berhasil dibuat',
                signature: signatureData,
                public_id: public_id
            });
        }

        return res.status(400).json({ message: 'Tipe upload tidak valid' });

    } catch (error) {
        console.error('[Signature Controller] Error:', error);
        return res.status(error.statusCode || 500).json({
            message: error.message || 'Terjadi kesalahan saat membuat signature',
        });
    }
};

const handleCloudinaryWebhook = async (req, res) => {
    try {
        const { notification_type, info_status } = req.body;

        if (notification_type === "upload" || notification_type === "raw_convert") {
            await videoService.finalizeVideoFromWebhook(req.body);
        }

        if (notification_type === "info" && info_status === "pending") {
        }

        if (notification_type === "info" && info_status === "complete") {
            await videoService.finalizeVideoFromWebhook(req.body);
        }

        // console.log("📩 Webhook payload:", JSON.stringify(req.body, null, 2));

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("❌ Error processing Cloudinary webhook:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal memproses webhook",
        });
    }
};

module.exports = {
    handleGenerateSignature,
    handleCloudinaryWebhook
}