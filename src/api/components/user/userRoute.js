import express from 'express';
import userController from './userController.js';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:token', userController.resetPassword);

// Protect all routes after this middlewarenpm start
// router.use(authController.protect);

router.patch('/updateMyPassword', userController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);

// router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

export default router;
