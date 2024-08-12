const brandModel = require('../../models/brandModel')
const apiResponse = require("../../helpers/apiResponse");
const { s3Uploadv2 } = require('../../service/s3_service');
require('dotenv').config();


const createBrand = async (req, res, next) => {

	const file = req.files;

	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}

	try {

		const data = req.body;
		const result = await s3Uploadv2(file);
		data.brandImage = result[0].Location;

		const brandData = new brandModel(data);
		brandData.save(function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else {
				return apiResponse.successResponseWithData(res, "Brand Created.", brandData);
			}
		});
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const getBrand = async (req, res, next) => {
	try {

		const brandData = await brandModel.find()

		if (brandData.length > 0) {


			let brandDatanew = [];

			brandData.forEach((doc) => {
				brandDatanew.push({
					_id: doc._id,
					brandName: doc.brandName,
					brandImageFile: doc.brandImage,
					brandImageMobile: [doc.brandImage],
				});
			});


			return apiResponse.successResponseWithData(res, "Brand List.", brandData);
		} else {
			return apiResponse.notFoundResponse(res, "Brand not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const deleteBrand = async (req, res) => {
	try {
		const { brand_id } = req.body;

		const brandData = await brandModel.findOneAndDelete({ _id: brand_id }).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data.length != 0) {
				return apiResponse.successResponse(res, "Brand Deleted Sucessfully.");
			} else {
				return apiResponse.notFoundResponse(res, "Brand Not Found.");
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

const updateBrand = async (req, res) => {
	const file = req.files;

	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}

	try {
		const result = await s3Uploadv2(file);


		const { brandId, brandName } = req.body;


		await brandModel.findOne({ _id: brandId }).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data) {
				data.brandName = brandName;
				data.brandImage = result[0].Location;

				data.save();

				return apiResponse.successResponseWithData(res, "Brand Data Updated SUcessfully.", data);
			} else {
				return apiResponse.notFoundResponse(res, "Brand Data Not Found.");
			}
		});
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

module.exports = { createBrand, getBrand, deleteBrand, updateBrand }