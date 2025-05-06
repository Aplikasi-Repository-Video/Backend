const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const SALT = +process.env.SALT;

const createUser = async (user) => {
    const userExist = await getUserByEmail(user.email);

    if (userExist) {
        throw new Error('Email sudah digunakan');
    }

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
        throw new Error('Pengguna tidak ditemukan');
    }

    return user;
};

const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    return user;
};

const updateUser = async (id, user, isAdmin) => {
    if (isAdmin) {
        const { role, isActive } = user;

        if (role && !['USER', 'ADMIN'].includes(role)) {
            throw new Error('Role tidak valid');
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            throw new Error('Status isActive harus boolean');
        }
    }

    await getUserById(id);

    if (user.email) {
        const userEmailExist = await getUserByEmail(user.email);
        if (userEmailExist && userEmailExist.id !== id) {
            throw new Error('Email telah digunakan');
        }
    }


    const data = {
        name: user.name,
        email: user.email,
        password: user.password ? bcrypt.hashSync(user.password, SALT) : undefined,
        updated: new Date(),
        ...(isAdmin && { role: user.role, isActive: user.isActive })
    };

    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};



const deleteUser = async (id) => {
    const userExist = await getUserById(id);

    if (!userExist) {
        throw new Error('Pengguna tidak ditemukan');
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