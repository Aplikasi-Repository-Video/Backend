const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
const { generateToken } = require('../utils/token');


const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email atau password salah');
    if (!user.isActive) throw new Error('User tidak aktif');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email atau password salah');

    const token = generateToken({ id: user.id, role: user.role, email: user.email });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    loginUser,
};
