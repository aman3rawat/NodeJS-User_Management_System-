const express = require('express');
const authController = require('../controller/authController');
const userController = require('./../controller/userController');

const router = express.Router();

router.post('/createUser', authController.protect, authController.restrictTo('admin', 'super-admin'), userController.createUser);

router.post('/login', authController.login);

router.get('/', authController.protect, authController.restrictTo('admin', 'super-admin'), userController.getAllUser);

router.patch('/updateUser/:id', authController.protect, authController.restrictTo('admin', 'super-admin'), userController.updateUser);

router.delete('/deleteUser/:id', authController.protect, authController.restrictTo('admin', 'super-admin'), userController.deleteUser);

module.exports = router;
