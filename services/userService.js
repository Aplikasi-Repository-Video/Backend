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

    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

const updateUser = async (id, user) => {
    const userExist = await getUserById(id);

    if (!userExist) {
        throw new Error('User not found');
    }
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
    const userExist = await getUserById(id);

    if (!userExist) {
        throw new Error('User not found');
    }

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