const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createWatchHistory = async (watchHistory) => {
    return await prisma.watchHistory.create({ data: watchHistory });
}

const getAllWatchHistory = async () => {
    return await prisma.watchHistory.findMany();
}

const getAllWatchHistoryByUserId = async (id) => {
    return await prisma.watchHistory.findMany({
        where: {
            userId: id
        }
    });
}

const deleteWatchHistory = async (id) => {
    return await prisma.watchHistory.delete({ where: { id: id } });
}

module.exports = {
    createWatchHistory,
    getAllWatchHistory,
    getAllWatchHistoryByUserId,
    deleteWatchHistory
}