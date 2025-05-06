const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '1d') =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

module.exports = { generateToken };