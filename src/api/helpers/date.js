import moment from 'moment';

exports.getCurrentDateTime = () => {
	return moment().utc().toDate();
};

exports.dateToUtc = (date) => {
	return moment(date).utc().toDate();
};

exports.daysBetweenToDates = (startDate, endDate) => {
	const date1 = new Date(startDate);
	const date2 = new Date(endDate);
	const Difference_In_Time = date2.getTime() - date1.getTime();
	const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
	return Difference_In_Days;
};

exports.getDatesBetweenDays = (daysDiff, endDate) => {
	// Test Cases Done
	const date = new Date(endDate);
	date.setDate(date.getDate() - daysDiff);
	return date;
};

exports.getAddMonthsInDate = (month) => {
	return new Date(new Date().setMonth(new Date().getMonth() + month)); // Test Cases Done
};

exports.addDaysInDate = (days) => {
	return moment(moment().utc().toDate(), 'DD-MM-YYYY')
		.add(days, 'days')
		.utc()
		.toDate(); // Test Cases Done
};
