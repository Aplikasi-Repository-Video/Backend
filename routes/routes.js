const routes = require('express').Router()
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')

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


module.exports = routes