const express = require('express');
const authController = require('../controller/authController');
const adminController = require('./../Controller/adminController');

const router = express.Router();

router.post('/createAdmin', authController.protect, authController.restrictTo('super-admin'), adminController.createAdmin);

router.post('/login', authController.login);

router.patch('/updateAdmin/:id', authController.protect, authController.restrictTo('super-admin'), adminController.updateAdmin);

router.delete('/deleteAdmin/:id', authController.protect, authController.restrictTo('super-admin'), adminController.deleteAdmin);

module.exports = router;

