const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const SALT = +process.env.SALT;

const createUser = async (user) => {
    const data = {
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, SALT),
        role: 'USER',
        created: new Date(),
        updated: new Date()
    };

    const createdUser = await prisma.user.create({ data });

    const { password, ...userWithoutPassword } = createdUser;

    return userWithoutPassword;
};

const getAllUsers = async () => {
    return await prisma.user.findMany();
};

const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
};

const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
};

const updateUser = async (id, user) => {
    const data = {
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, SALT),
        updated: new Date()
    };

    const updatedUser = await prisma.user.update({
        where: {
            id: id,
        },
        data: data,
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
};

const deleteUser = async (id) => {
    const deletedUser = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            isActive: false,
            updated: new Date(),
        },
    });

    const { password, ...userWithoutPassword } = deletedUser;

    return userWithoutPassword;
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};