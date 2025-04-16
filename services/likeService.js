const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeVideo = async ({ user_id, video_id }) => {
    return await prisma.like.create({
        data: {
            user_id,
            video_id,
            created: new Date(),
            updated: new Date()
        }
    });
};

const unlikeVideo = async (id) => {
    return await prisma.like.delete({ where: { id } });
};

const getLikesByVideoId = async (video_id) => {
    const likes = await prisma.like.findMany({
        where: { video_id },
        include: {
            User: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    const total = await prisma.like.count({ where: { video_id } });
    return { likes, total };
};

module.exports = {
    likeVideo,
    unlikeVideo,
    getLikesByVideoId
};
