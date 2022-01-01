import sgMail from '@sendgrid/mail';
// import logger from '../config/logger.js';
import config from '../config/config.js';

sgMail.setApiKey(config.sendgrid.sendgrid_api_key);

const mailHelper = (data) => {
	const obj = {
		to: data.receiver,
		from: config.sendgrid.mail,
		subject: '',
		templateId: '',
		dynamic_template_data: {},
	};
	let emailTemplateId = '';


	switch (data.templateType) {
		case 'VERIFY_USER': {
			obj.subject = 'Verify User';
			obj.templateId = emailTemplateId;
			obj.dynamic_template_data = {
				otp: data.otp,
				name: data.userName
			}
			break;
		}
		case 'FORGOT_PASSWORD': {
			obj.subject = 'Reset Password Link';
			obj.templateId = emailTemplateId;
			obj.dynamic_template_data = {
				otp: data.otp
			}
			break;
		}
		default: {
			break;
		}
	}

	return sgMail.send(obj, (err, result) => {
		if (err) {
			console.log(`Inside mailHelper helper : ${err}`);
		} else {
			console.log(`Inside mailHelper helper : ${result}`);
		}
	});
};

export default mailHelper;
