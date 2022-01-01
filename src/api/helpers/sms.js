import twilio from 'twilio'
import config from '../config/config.js';
import catchAsync from './catchAsync.js';

const sendSMS = catchAsync(async (objData, callback) => {
	const accountSID = config.sendgrid.account_SID;
	const authToken = config.auth_token;
	const trialNumber = config.sendgrid.trial_number;
	const client = twilio(accountSID, authToken);
	try {
		return await client.messages.create({
			body: `Your Verification Code is : ${objData.otp}`,
			from: trialNumber,
			to: objData.countryCode + objData.mobileNumber,
		});

	} catch (e) {
		callback(e);
	}

});

export default sendSMS;
