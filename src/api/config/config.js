import dotenv from 'dotenv';

dotenv.config();
export default {
	apiVersionUrl: '/api/v1',
	env: 'production',
	//env: 'development',
	auth_token:
		process.env.NODE_ENV === 'development'
			? process.env.AUTH_DEV_TOKEN
			: process.env.AUTH_PROD_TOKEN,

	jwtSecret: 'process.env.JWT_SECRET',
	jwtExpiresIn: 20000,
	nft_gallery_url:
		process.env.NODE_ENV === 'development'
			? process.env.NFT_GALLERY_DEV_URL
			: process.env.NFT_GALLERY_PROD_URL,

	db: {
		str: 'mongodb+srv://ketan12025:ketan200@cluster0.9byxy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
		options: {
			useNewUrlParser: true,
			readPreference: 'primaryPreferred',
			useUnifiedTopology: true,
		},
	},

	// sendgrid: {
	// 	sendgrid_api_key:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.SEND_GRID_API_DEV_KEY
	// 			: process.env.SEND_GRID_API_PROD_KEY,
	// 	account_SID:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_ACCOUNT_SID
	// 			: process.env.PROD_ACCOUNT_SID,
	// 	trial_number:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_TRIAL_NUMBER
	// 			: process.env.PROD_TRIAL_NUMBER,
	// 	mail:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_CONFIG_MAIL
	// 			: process.env.PROD_CONFIG_MAIL,
	// },

	// awsConfig: {
	// 	secretAccessKey:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_AWS_SECRET_ACCESS_KEY
	// 			: process.env.PROD_AWS_SECRET_ACCESS_KEY,

	// 	accessKeyId:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_AWS_ACCESS_KEY_ID
	// 			: process.env.PROD_AWS_ACCESS_KEY_ID,

	// 	region:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_AWS_REGION
	// 			: process.env.PROD_AWS_REGION,
	// 	s3BucketUrl:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_AWS_S3_BUCKET_URL
	// 			: process.env.PROD_AWS_S3_BUCKET_URL,

	// 	s3BucketName:
	// 		process.env.NODE_ENV === 'development'
	// 			? process.env.DEV_AWS_S3_BUCKET_NAME
	// 			: process.env.PROD_AWS_S3_BUCKET_NAME,
	// },
};
