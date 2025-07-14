const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const videoController = require('../controllers/videoController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const watchHistoryController = require('../controllers/watchHistoryController');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');

const routeConfigs = [
    { method: 'get', path: '/', controller: (req, res) => res.json({ message: 'Hello... World...' }), middlewares: [] },
    { method: 'post', path: '/login', controller: authController.login, middlewares: [] },
    { method: 'post', path: '/register', controller: userController.createUser, middlewares: [] },

    // Users
    { method: 'get', path: '/users', controller: userController.getAllUsers, middlewares: ['auth', 'admin'] },
    { method: 'get', path: '/users/email/:email', controller: userController.getUserByEmail, middlewares: ['auth', 'admin'] },
    { method: 'post', path: '/users', controller: userController.createUser, middlewares: [] },
    { method: 'get', path: '/users/id/:id', controller: userController.getUserById, middlewares: ['auth', 'admin'] },
    { method: 'put', path: '/users/:id', controller: userController.updateUser, middlewares: ['auth', 'user'] },
    { method: 'delete', path: '/users/:id', controller: userController.deleteUser, middlewares: ['auth', 'user'] },

    // Categories
    { method: 'get', path: '/categorios/has-videos', controller: categoryController.getCategoriesWithVideos, middlewares: [] },
    { method: 'get', path: '/categories', controller: categoryController.getAllCategories, middlewares: [] },
    { method: 'post', path: '/categories', controller: categoryController.createCategory, middlewares: ['auth', 'admin'] },
    { method: 'put', path: '/categories/:id', controller: categoryController.updateCategory, middlewares: ['auth', 'admin'] },
    { method: 'delete', path: '/categories/:id', controller: categoryController.deleteCategory, middlewares: ['auth', 'admin'] },

    // Videos
    {
        method: 'post',
        path: '/videos',
        controller: videoController.createVideo,
        middlewares: ['auth', 'admin']
    },
    {
        method: 'put',
        path: '/videos/:id',
        controller: videoController.updateVideo,
        middlewares: ['auth', 'admin']
    },
    { method: 'delete', path: '/videos/:id', controller: videoController.deleteVideo, middlewares: ['auth', 'admin'] },
    { method: 'get', path: '/videos', controller: videoController.getAllVideos, middlewares: [] },
    { method: 'get', path: '/videos/:id', controller: videoController.getVideoById, middlewares: [] },
    { method: 'get', path: '/videos/category/:categoryId', controller: videoController.getVideosByCategory, middlewares: [] },

    // Comments
    { method: 'post', path: '/comments', controller: commentController.createComment, middlewares: ['auth', 'user'] },
    { method: 'get', path: '/comments', controller: commentController.getAllComments, middlewares: ['auth', 'admin'] },
    { method: 'get', path: '/comments/:videoId', controller: commentController.getComments, middlewares: [] },
    { method: 'delete', path: '/comments/:id', controller: commentController.deleteComment, middlewares: ['auth', 'user'] },

    // Likes
    { method: 'post', path: '/likes', controller: likeController.toggleLike, middlewares: ['auth', 'user'] },
    { method: 'get', path: '/likes/user', controller: likeController.getLikesByUserId, middlewares: ['auth', 'user'] },
    { method: 'get', path: '/likes/:videoId', controller: likeController.getLikes, middlewares: [] },

    // Watch History
    { method: 'post', path: '/watch-history', controller: watchHistoryController.createWatchHistory, middlewares: [] },
    { method: 'get', path: '/watch-history', controller: watchHistoryController.getAllWatchHistory, middlewares: [] },
    { method: 'put', path: '/watch-history/:id', controller: watchHistoryController.updateWatchHistory, middlewares: [] },
    { method: 'delete', path: '/watch-history/:id', controller: watchHistoryController.deleteWatchHistory, middlewares: [] },

    // Search
    { method: 'get', path: '/search', controller: searchController.searchController, middlewares: [] }
];

module.exports = routeConfigs;
