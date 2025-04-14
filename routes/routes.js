const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const videoController = require('../controllers/videoController')

const routes = require('express').Router()
const upload = require('../middleware/upload');

routes.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

routes.get('/users', userController.getAllUsers)
routes.get('/users/email/:email', userController.getUserByEmail)
routes.get('/users/id/:id', userController.getUserById)
routes.post('/users', userController.createUser)
routes.put('/users/:id', userController.updateUser)
routes.delete('/users/:id', userController.deleteUser)

routes.get('/categories', categoryController.getAllCategories)
routes.get('/categories/:id', categoryController.getCategoryById)
routes.post('/categories', categoryController.createCategory)
routes.put('/categories/:id', categoryController.updateCategory)
routes.delete('/categories/:id', categoryController.deleteCategory)

routes.get('/videos', videoController.getAllVideos)
routes.get('/videos/:id', videoController.getVideoById)
routes.post(
    '/videos',
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    videoController.createVideo
);
routes.put(
    '/videos/:id',
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    videoController.updateVideo
);
routes.delete('/videos/:id', videoController.deleteVideo)




module.exports = routes