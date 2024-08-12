const CourseModel = require('../../models/CourseModel')
const apiResponse = require("../../helpers/apiResponse");
require('dotenv').config();


const createCourse = async (req, res, next) => {


	try {

		const {courseName, courseFees} = req.body;

		const CourseData = new CourseModel({courseName : courseName, courseFees: courseFees});
		CourseData.save()
		return apiResponse.successResponseWithData(res, "Course Created.", CourseData);
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const getCourse = async (req, res, next) => {
	try {

		const CourseData = await CourseModel.find().lean()

		if (CourseData.length > 0) {

			return apiResponse.successResponseWithData(res, "Course List.", CourseData);
		} else {
			return apiResponse.notFoundResponse(res, "Course not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const deleteCourse = async (req, res) => {
	try {
		const { Course_id } = req.body;

		const CourseData = await CourseModel.findOneAndDelete({ _id: Course_id }).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data.length != 0) {
				return apiResponse.successResponse(res, "Course Deleted Sucessfully.");
			} else {
				return apiResponse.notFoundResponse(res, "Course Not Found.");
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

const updateCourse = async (req, res) => {
	
	try {
		
		const { courseId, courseName } = req.body;
		await CourseModel.findOne({ _id: courseId }).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data) {
				data.courseName = courseName;

				data.save();

				return apiResponse.successResponseWithData(res, "Course Data Updated SUcessfully.", data);
			} else {
				return apiResponse.notFoundResponse(res, "Course Data Not Found.");
			}
		});
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

module.exports = { createCourse, getCourse, deleteCourse, updateCourse }