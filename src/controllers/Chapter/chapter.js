const ChapterModel = require('../../models/ChapterModel')
const apiResponse = require("../../helpers/apiResponse");
const { deleteFileFromS3 } = require('../../helpers/fileUploader');
require('dotenv').config();


const createChapter = async (req, res, next) => {


	try {

		const {chapterName, courseId, description} = req.body;
		const chapterImage = req.files['chapterImage'] ? req.files['chapterImage'][0].key : null;
		const ChapterData = new ChapterModel({chapterName : chapterName, courseId: courseId, chapterImage: chapterImage, description:description});
		await ChapterData.save()
		return apiResponse.successResponseWithData(res, "Chapter Created.", ChapterData);
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const getChapter = async (req, res, next) => {
	try {

		const ChapterData = await ChapterModel.find().lean()

		if (ChapterData.length > 0) {

			return apiResponse.successResponseWithData(res, "Chapter List.", ChapterData);
		} else {
			return apiResponse.notFoundResponse(res, "Chapter not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getChapterbyId = async (req, res, next) => {
	try {

		const ChapterData = await ChapterModel.findById(req.params.id).lean()

		if (ChapterData) {

			return apiResponse.successResponseWithData(res, "Chapter List.", ChapterData);
		} else {
			return apiResponse.notFoundResponse(res, "Chapter not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getChaptersbyCourseId = async (req, res, next) => {
	try {

		const ChapterData = await ChapterModel.find({"courseId": req.params.id}).lean()

		if (ChapterData) {

			return apiResponse.successResponseWithData(res, "Chapter List.", ChapterData);
		} else {
			return apiResponse.notFoundResponse(res, "Chapter not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};


const deleteChapter = async (req, res) => {
	try {
		const { Chapter_id } = req.body;

		const existingChapter = await ChapterModel.findById(req.params.id);
	  
		if (!existingChapter) {
			return res.status(404).json({ message: 'Chapter not found' });
		}
	
		// Delete associated files from S3
		if (existingChapter.chapterImage) {
			await deleteFileFromS3(existingChapter.chapterImage);
		}

		const ChapterData = await ChapterModel.findByIdAndDelete(req.params.id).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data.length != 0) {
				return apiResponse.successResponse(res, "Chapter Deleted Sucessfully.");
			} else {
				return apiResponse.notFoundResponse(res, "Chapter Not Found.");
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

const updateChapter = async (req, res) => {
	
	try {
		
		const {chapterName, courseId, description } = req.body;
		const chapterImage = req.files['chapterImage'] ? req.files['chapterImage'][0].key : null;
		await ChapterModel.findById(req.params.id).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data) {
				// data.chapterName = chapterName;
				if (chapterName) data.chapterName = chapterName;
	  			if (courseId) data.courseId = courseId;
				if (chapterImage) data.chapterImage = chapterImage;
				if (description) data.description = description;

				data.save();

				return apiResponse.successResponseWithData(res, "Chapter Data Updated SUcessfully.", data);
			} else {
				return apiResponse.notFoundResponse(res, "Chapter Data Not Found.");
			}
		});
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

module.exports = { createChapter, getChapter, deleteChapter, updateChapter, getChapterbyId, getChaptersbyCourseId }