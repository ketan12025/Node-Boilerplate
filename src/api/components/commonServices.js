import APIFeatures from './../helpers/apiFeature.js';

const deleteOne = async (Model, filterObj) => {
	const doc = await Model.findOneAndDelete(filterObj);

	return doc;
};

const updateOne = async (Model, filterObj, updateObj) => {
	const doc = await Model.findOneAndUpdate(filterObj, updateObj, {
		new: true,
		runValidators: true,
	});
	return doc;
};

const createOne = async (Model, dataObj) => {
	const doc = await Model.create(dataObj);
	return handleResponse({
		res,
		statusCode: 201,
		msg: 'Document created',
		data: doc,
	});
};

//popOption = populate fields
const getOne = async (Model, filterObj, popOptions) => {
	let query = Model.findOne(filterObj);
	if (popOptions) query = query.populate(popOptions);
	const doc = await query;
	return doc;
};

const getAll = async (Model, filterObj, popOptions) => {
	let query = Model.find();
	if (popOptions) query = query.populate(popOptions);
	const features = new APIFeatures(query, filterObj)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const doc = await features.query;

	return doc;
};

export default { getAll, getOne, createOne, updateOne, deleteOne };
