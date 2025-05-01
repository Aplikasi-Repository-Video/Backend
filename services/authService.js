const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email tidak ditemukan');
    if (!user.isActive) throw new Error('User tidak aktif');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Password salah');

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
};

module.exports = {
    loginUser,
};
