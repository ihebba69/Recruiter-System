const userController = require('../controller/userController');
const router= require('express').Router()
router.post('/add', userController.createUser);
router.get('/', userController.listUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUser)

module.exports = router;