const express = require('express');
const router = express.Router();
const routeConfigs = require('./routeConfig');

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const middlewareMap = {
    auth: authenticateToken,
    user: authorizeRoles('USER', 'ADMIN'),
    admin: authorizeRoles('ADMIN'),
};

routeConfigs.forEach(({ method, path, controller, middlewares }) => {
    const resolvedMiddleware = middlewares.map(mw =>
        typeof mw === 'string' ? middlewareMap[mw] : mw
    );

    router[method](path, ...resolvedMiddleware, controller);
});

module.exports = router;
