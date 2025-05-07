const prisma = require('../prisma/client');

const getAllCategories = () => {
    return prisma.category.findMany();
};

const getCategoryById = (id) => {
    return prisma.category.findUnique({ where: { id } });
};

const createCategory = ({ name }) => {
    return prisma.category.create({
        data: {
            name,
            created: new Date(),
            updated: new Date(),
        },
    });
};

const updateCategory = (id, { name }) => {
    return prisma.category.update({
        where: { id },
        data: {
            name,
            updated: new Date(),
        },
    });
};

const deleteCategory = (id) => {
    return prisma.category.delete({ where: { id } });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
