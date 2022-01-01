import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import config from '../config/config.js';
import constants from '../config/constant.js';
// import logger from '../config/logger.js';
import { handleError } from '../helpers/responseHandler.js';

let fileObj = {};
let fileField = 'uploadFile';

aws.config.update(config.awsConfig);

const s3 = new aws.S3();

const uploadSetting = multerS3({
	s3,
	bucket: config.awsConfig.s3BucketName,
	acl: 'public-read',
	ContentEncoding: 'base64',
	contentType: (req, file, cb) => {
		cb(null, file.mimetype);
	},
	metadata: (req, file, cb) => {
		cb(null, { classification: 'image', ...req.body });
	},
	key: (req, file, cb) => {
		const filename = file.originalname;
		const fileExtension = filename.split('.')[1];
		let pathName = `uploads/${fileObj.name}`;
		if (fileObj.name === 'users/') {
			const { type } = req.query;
			const userPicType = type ? type : 'profilePic';
			pathName = `uploads/${fileObj.name}${userPicType}`;
		}

		cb(null, `${pathName}_${Date.now()}.${fileExtension}`);
	},
});

const upload = multer({
	storage: uploadSetting,
	fileFilter: (req, file, cb) => {
		if (fileObj.type.includes(file.mimetype)) {
			cb(null, true);
		} else {
			return cb(new Error(fileObj.errorMsg));
		}
	},
}).fields([{ name: fileField }]);

const UploadFileOnS3 = (req, res, next) => {
	try {
		let fileUploadedType = req.originalUrl;

		constants.UPLOAD_FILE_AWS.map((item) => {
			if (fileUploadedType.includes(item['title'])) {
				fileObj = item;
			}
		});

		upload(req, res, (error) => {
			if (error) {
				// logger.info(`Error from aws ->  ${error}`);
				return handleError({
					res,
					statusCode: 400,
					err: error.message,
				});
			} else {
				next();
			}
		});
	} catch (error) {
		return handleError({
			res,
			statusCode: 400,
			err: error.message,
		});
	}
};

export default UploadFileOnS3;
