const userService = require("../services/userService");
const { validateUser, validateUserId, validateUserEmail } = require("../validations/userValidation");

const createUser = async (req, res) => {
    try {
        const { error } = validateUser.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const user = await userService.createUser(req.body);
        console.log(user);
        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { error } = validateUserId.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const user = await userService.getUserById(+req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { error } = validateUserEmail.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const user = await userService.getUserByEmail(req.params.email);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { error: userIdError } = validateUserId.validate(req.params);
        const { error: userError } = validateUser.validate(req.body);

        if (userIdError || userError) {
            return res.status(400).json({
                message: userIdError ? userIdError.details[0].message : userError.details[0].message
            });
        }

        const user = await userService.updateUser(+req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { error } = validateUserId.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const user = await userService.deleteUser(+req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
};