const prisma = require('../prisma/client');
const { assignUserIdentity, getWatchHistorySelector } = require('../utils/assignUserIdentity'); // sesuaikan path-nya

const createWatchHistory = async (watchHistory) => {
    const baseData = {
        video_id: Number(watchHistory.video_id),
        duration_watch: Number(watchHistory.duration_watch),
        created: new Date(),
        updated: new Date()
    };

    const identity = assignUserIdentity(watchHistory);
    const where = getWatchHistorySelector(watchHistory);

    const result = await prisma.watchHistory.upsert({
        where,
        create: { ...baseData, ...identity },
        update: {
            duration_watch: baseData.duration_watch,
            updated: new Date()
        }
    });

    return result;
};


const getAllWatchHistory = async (watchHistory) => {
    let where = {};

    const data = assignUserIdentity(watchHistory, where);
    const result = await prisma.watchHistory.findMany({
        where: data,
        include: {
            Video: true
        }
    });

    return result;
};

const getWatchHistoryById = async (id) => {
    const result = await prisma.watchHistory.findUnique({ where: { id } });

    if (!result) {
        throw new Error('Riwayat tidak ditemukan');
    }

    return result;
}

const updateWatchHistory = async (id, watchHistory) => {
    let data = {
        duration_watch: +watchHistory.duration_watch,
        updated: new Date()
    };

    const result = await prisma.watchHistory.update({
        where: {
            id: id
        },
        data: data
    });

    return result;
};

const deleteWatchHistory = async (id) => {
    const existingWatchHistory = await getWatchHistoryById(id);

    const result = await prisma.watchHistory.delete({
        where: {
            id: existingWatchHistory.id
        }
    });

    return result;

}

module.exports = {
    createWatchHistory,
    getAllWatchHistory,
    updateWatchHistory,
    deleteWatchHistory
}