const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllVideos = async () => {
    return await prisma.video.findMany();
}

const getVideoById = async (id) => {
    return await prisma.video.findUnique({
        where: {
            id: id
        }
    });
}

const createVideo = async (video) => {
    return await prisma.video.create({
        data: video
    });
}

const updateVideo = async (id, video) => {
    return await prisma.video.update({
        where: {
            id: id
        },
        data: video
    });
}

const deleteVideo = async (id) => {
    return await prisma.video.delete({
        where: {
            id: id
        }
    });
}

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
};