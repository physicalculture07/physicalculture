const CourseModel = require('../../models/CourseModel')
const apiResponse = require("../../helpers/apiResponse");
require('dotenv').config();


const createCourse = async (req, res, next) => {


	try {

		const {courseName, courseFees, courseValidity} = req.body;
		const courseImage = req.files['courseImage'] ? req.files['courseImage'][0].location : null;
		const CourseData = new CourseModel({courseName : courseName, courseFees: courseFees, courseValidity: courseValidity, courseImage: courseImage});
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

const getCoursebyId = async (req, res, next) => {
	try {

		const CourseData = await CourseModel.findById(req.params.id).lean()

		if (CourseData) {

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

		const existingCourse = await CourseModel.findById(req.params.id);
	  
		if (!existingCourse) {
			return res.status(404).json({ message: 'Class not found' });
		}
	
		// Delete associated files from S3
		if (existingCourse.courseImage) {
			await deleteFileFromS3(existingCourse.courseImage);
		}

		const CourseData = await CourseModel.findByIdAndDelete(req.params.id).then(function (data, err) {
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
		
		const {courseName, courseFees,courseValidity } = req.body;
		const courseImage = req.files['courseImage'] ? req.files['courseImage'][0].key : null;
		await CourseModel.findById(req.params.id).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data) {
				// data.courseName = courseName;
				if (courseName) data.courseName = courseName;
	  			if (courseFees) data.courseFees = courseFees;
				if (courseValidity) data.courseValidity = courseValidity;
				if (courseImage) data.courseImage = courseImage;

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

module.exports = { createCourse, getCourse, deleteCourse, updateCourse, getCoursebyId }