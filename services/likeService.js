const prisma = require('../prisma/client');

const toggleLike = async ({ user_id, video_id }) => {
    const existingLike = await prisma.like.findFirst({
        where: {
            user_id: +user_id,
            video_id: +video_id
        }
    });

    if (existingLike) {
        await prisma.like.delete({
            where: { id: existingLike.id }
        });
        return { message: 'Unliked' };
    } else {
        const newLike = await prisma.like.create({
            data: {
                user_id: +user_id,
                video_id: +video_id,
                created: new Date(),
                updated: new Date()
            }
        });
        return newLike;
    }
}

const getLikesByVideoId = async (video_id) => {
    const likes = await prisma.like.findMany({
        where: { video_id },
        select: {
            video_id: true,
            user_id: true,
            User: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })
    const total = await prisma.like.count({ where: { video_id } });
    return { likes, total };
};

module.exports = {
    getLikesByVideoId,
    toggleLike
};
