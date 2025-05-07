const prisma = require('../prisma/client');

const createComment = async ({ content, user_id, video_id }) => {
    try {
        return prisma.comment.create({
            data: {
                content,
                user_id: +user_id,
                video_id: +video_id,
                created: new Date(),
                updated: new Date()
            }
        });

    } catch (error) {
        throw error;
    }
};

const getCommentsByVideoId = async (video_id) => {
    try {
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

    } catch (error) {
        throw error;
    }
};

const deleteComment = async (id) => {
    try {
        return await prisma.comment.delete({
            where: { id }
        });

    } catch (error) {
        throw error;
    }
};

module.exports = {
    createComment,
    getCommentsByVideoId,
    deleteComment
};
