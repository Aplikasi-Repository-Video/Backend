const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComment = async ({ content, user_id, video_id }) => {
    return await prisma.comment.create({
        data: {
            content,
            user_id: +user_id,
            video_id: +video_id,
            created: new Date(),
            updated: new Date()
        }
    });
};

const getCommentsByVideoId = async (video_id) => {
    const comments = await prisma.comment.findMany({
        where: { video_id },
        orderBy: { created: 'desc' },
        include: {
            User: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },

    });

    const total = await prisma.comment.count({ where: { video_id } });

    return { comments, total };
};

const deleteComment = async (id) => {
    return await prisma.comment.delete({ where: { id } });
}
module.exports = {
    createComment,
    getCommentsByVideoId,
    deleteComment
};
