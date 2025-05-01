const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const assignUserIdentity = require('../utils/assignUserIdentity'); // sesuaikan path-nya
const { de } = require('@faker-js/faker');

const createWatchHistory = async (watchHistory) => {
    let data = {
        video_id: +watchHistory.video_id,
        duration_watch: +watchHistory.duration_watch,
        created: new Date(),
        updated: new Date()
    };

    data = assignUserIdentity(watchHistory, data);

    const result = await prisma.watchHistory.create({ data });
    return result;
}

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
    await getWatchHistoryById(id);

    const result = await prisma.watchHistory.delete({
        where: { id }
    });

    return result;

}

module.exports = {
    createWatchHistory,
    getAllWatchHistory,
    updateWatchHistory,
    deleteWatchHistory
}