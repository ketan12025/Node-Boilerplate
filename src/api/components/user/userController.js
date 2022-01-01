import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from './userModel.js';
import catchAsync from '../../helpers/catchAsync.js';
import { AppError, handleResponse } from '../../helpers/responseHandler.js';
import config from '../../config/config.js';
import factory from './../commonServices.js';

const signToken = (id) => {
	return jwt.sign({ id }, config.jwtSecret, {
		expiresIn: config.jwtExpiresIn,
	});
};

const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user._id);

	res.cookie('jwt', token, {
		expires: new Date(Date.now() + config.jwtExpiresIn),
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	});

	user.password = undefined;
	return handleResponse({ res, data: { token, user } });
};

const signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});

	// const url = `${req.protocol}://${req.get('host')}/me`;
	// // console.log(url);
	// await new Email(newUser, url).sendWelcome();
	createSendToken(newUser, 201, req, res);
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	createSendToken(user, 200, req, res);
});

const logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};

const restrictTo = (...roles) => {
	return (req, res, next) => {
		// roles ['admin', 'lead-guide']. role='user'
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to perform this action', 403)
			);
		}
		next();
	};
};

const forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with email address.', 404));
	}

	// 2) Generate the random reset token
	const resetToken = Math.random() * 6;
	user.passwordResetToken = resetToken;
	await user.save({ validateBeforeSave: false });

	// 3) Send it to user's email
	try {
		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/users/resetPassword/${resetToken}`;
		// await new Email(user, resetURL).sendPasswordReset();
		return handleResponse({ res, msg: 'Token sent to email!' });
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError('There was an error sending the email. Try again later!'),
			500
		);
	}
});

const resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 3) Update changedPasswordAt property for the user
	// 4) Log the user in, send JWT
	createSendToken(user, 200, req, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get user from collection
	const user = await User.findById(req.user.id).select('+password');

	// 2) Check if POSTed current password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong.', 401));
	}

	// 3) If so, update password
	user.password = req.body.password;
	await user.save();

	// 4) Log user in, send JWT
	createSendToken(user, 200, req, res);
});

//Filtered out unwanted fields names that are not allowed to be updated
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

const getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

const updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTs password data
	if (req.body.password) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword.',
				400
			)
		);
	}

	const filteredBody = filterObj(req.body, 'name', 'email');
	if (req.file) filteredBody.profilePic = req.file.filename;

	// 3) Update user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});
	return handleResponse({ res, data: updatedUser });
});

const getUser = catchAsync(async (req, res, next) => {
	const user = await factory.getOne(User, { _id: req.params.id });
	if (!user) {
		return next(new AppError('No document found with that ID', 404));
	}
	handleResponse({ res, data: user });
});
const getAllUsers = catchAsync(async (req, res, next) => {
	const user = await factory.getAll(User, req.query);
	if (!user) {
		return next(new AppError('No document found with that ID', 404));
	}
	handleResponse({ res, data: user });
});
// Do NOT update passwords with this!
const updateUser = catchAsync(async (req, res, next) => {
	const user = await factory.updateOne(User, { _id: req.params.id }, req.body);
	if (!user) {
		return next(new AppError('No document found with that ID', 404));
	}
	handleResponse({ res, data: user });
});

const deleteUser = catchAsync(async (req, res, next) => {
	const user = await factory.deleteOne(User, { _id: req.params.id });
	if (!user) {
		return next(new AppError('No document found with that ID', 404));
	}
	handleResponse({ res, data: user });
});

export default {
	signup,
	login,
	logout,
	restrictTo,
	forgotPassword,
	resetPassword,
	updatePassword,
	getMe,
	updateMe,
	getUser,
	getAllUsers,
	updateUser,
	deleteUser,
};
