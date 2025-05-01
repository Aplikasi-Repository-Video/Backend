const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser({
            email,
            password
        });

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            token,
            user,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    login,
};
