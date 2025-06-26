const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const videoController = require('../controllers/videoController')
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const watchHistoryControiller = require('../controllers/watchHistoryController');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const routes = require('express').Router()
const upload = require('../middleware/upload');

routes.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

routes.post('/login', authController.login);

routes.get('/users', authenticateToken, authorizeRoles('USER',), userController.getAllUsers)
routes.get('/users/email/:email', authenticateToken, authorizeRoles('USER',), userController.getUserByEmail)
routes.get('/users/id/:id', authenticateToken, authorizeRoles('ADMIN'), userController.getUserById)
routes.post('/users', userController.createUser)
routes.put('/users/:id', authenticateToken, authorizeRoles('USER', 'ADMIN'), userController.updateUser)
routes.delete('/users/:id', authenticateToken, authorizeRoles('USER', 'ADMIN'), userController.deleteUser)

routes.get('/categories', categoryController.getAllCategories)
// routes.get('/categories/:id', categoryController.getCategoryById)
routes.post('/categories', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory)
routes.put('/categories/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.updateCategory)
routes.delete('/categories/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.deleteCategory)

routes.get('/videos', videoController.getAllVideos)
routes.get('/videos/:id', videoController.getVideoById)
routes.post('/videos', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), authenticateToken, authorizeRoles('ADMIN'), videoController.createVideo);
routes.put('/videos/:id', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), authenticateToken, authorizeRoles('ADMIN'), videoController.updateVideo);
routes.delete('/videos/:id', authenticateToken, authorizeRoles('ADMIN'), videoController.deleteVideo)

routes.post('/comments', authenticateToken, authorizeRoles('USER', 'ADMIN'), authenticateToken, authorizeRoles('USER', 'ADMIN'), commentController.createComment)
routes.get('/comments/:videoId', commentController.getComments)
routes.delete('/comments/:id', authenticateToken, authorizeRoles('USER', 'ADMIN'), commentController.deleteComment)

routes.post('/likes', authenticateToken, authorizeRoles('USER', 'ADMIN'), likeController.toggleLike)
routes.get('/likes/:videoId', likeController.getLikes)

routes.post('/watch-history', watchHistoryControiller.createWatchHistory)
routes.get('/watch-history/', watchHistoryControiller.getAllWatchHistory)
routes.put('/watch-history/:id', watchHistoryControiller.updateWatchHistory)
routes.delete('/watch-history/:id', watchHistoryControiller.deleteWatchHistory)

routes.get('/search', searchController.searchController)


module.exports = routes