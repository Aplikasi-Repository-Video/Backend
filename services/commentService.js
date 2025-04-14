const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllComments = async () => {
    return await prisma.comment.findMany();
};

const getCommentById = async (id) => {
    return await prisma.comment.findUnique({
        where: {
            id: id,
        },
    });
};

const getCommentByVideoId = async (id) => {
    return await prisma.comment.findUnique({
        where: {
            id: id,
        },
    });
};

const createComment = async (comment) => {
    return await prisma.comment.create({
        data: comment,
    });
};

const updateComment = async (id, comment) => {
    return await prisma.comment.update({
        where: {
            id: id,
        },
        data: comment,
    });
};

const deleteComment = async (id) => {
    return await prisma.comment.delete({
        where: {
            id: id,
        },
    });
};



module.exports = {
    getAllComments,
    getCommentById,
    getCommentByVideoId,
    createComment,
    updateComment,
    deleteComment
};