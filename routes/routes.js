const routes = require('express').Router()
const userController = require('../controllers/userController')

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



module.exports = routes