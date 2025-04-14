const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCategories = async () => {
    return await prisma.category.findMany();
};

const getCategoryById = async (id) => {
    return await prisma.category.findUnique({
        where: {
            id: id,
        },
    });
};

const createCategory = async (category) => {
    return await prisma.category.create({
        data: {
            name: category.name,
            created: new Date(),
            updated: new Date(),
        }
    });
};

const updateCategory = async (id, category) => {
    return await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            name: category.name,
            updated: new Date(),
        },
    });
};

const deleteCategory = async (id) => {
    return await prisma.category.delete({
        where: {
            id: id,
        },
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};