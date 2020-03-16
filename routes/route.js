const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess(), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('update:any', 'products'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('delete:any', 'products'), userController.deleteUser);


module.exports = router;