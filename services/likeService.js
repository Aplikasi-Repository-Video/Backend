const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllLikesByVideo = async (id) => {
    return await prisma.like.findMany({
        where: {
            videoId: id,
        }, select: {
            count: true
        },
    });
};

const createLike = async (like) => {
    return await prisma.like.create({ data: like });
};

const deleteLike = async (id) => {
    return await prisma.like.delete({ where: { id: id } });
};

module.exports = {
    getAllLikesByVideo,
    createLike,
    deleteLike
}