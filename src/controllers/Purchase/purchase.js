const PurchaseCourseModel = require('../../models/PurchaseCourseModel')
const PurchaseCourseHistoryModel = require('../../models/PurchaseCourseHistoryModel')
const PurchaseModel = require('../../models/PurchaseModel')

const apiResponse = require("../../helpers/apiResponse");
const { deleteFileFromS3 } = require('../../helpers/fileUploader');
const PurchaseDeleteModel = require('../../models/PurchaseDeleteModel');
require('dotenv').config();


const addCourseToUser = async (req, res, next) => {


	try {

		const {courseId,userId,purchaseDate,transactionId, amount, comment, paymentStatus} = req.body;

		const existingPurchase = await PurchaseModel.findOne({ courseId, userId });

		if (existingPurchase) {
		  return apiResponse.ErrorResponse(res, "Course already purchased by the user.");
		}


		const CourseData = new PurchaseModel({courseId : courseId,userId:userId, purchaseDate : purchaseDate,transactionId : transactionId,amount : amount,comment : comment,paymentStatus : paymentStatus});
		await CourseData.save()
		return apiResponse.successResponseWithData(res, "Course Created.", CourseData);
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const getPurchasedCourses =  async(req, res) => {
	try {
	  const {
		userId,
		courseId,
		paymentStatus,
		startDate,
		endDate,
		minAmount,
		maxAmount,
	  } = req.query;
  
	  // Build the query dynamically
	  const query = {};
  
	  if (userId) query.userId = userId;
	  if (courseId) query.courseId = courseId;
	  if (paymentStatus) query.paymentStatus = paymentStatus;
  
	  // Filter by date range
	  if (startDate || endDate) {
		query.purchaseDate = {};
		if (startDate) query.purchaseDate.$gte = new Date(startDate);
		if (endDate) query.purchaseDate.$lte = new Date(endDate);
	  }
  
	  // Filter by amount range
	  if (minAmount || maxAmount) {
		query.amount = {};
		if (minAmount) query.amount.$gte = minAmount;
		if (maxAmount) query.amount.$lte = maxAmount;
	  }
  
	  // Fetch data with course and user details
	  const purchases = await PurchaseModel.find(query)
		.populate("courseId", "courseName description") // Populate course details
		.populate("userId", "firstName mobileNo") // Populate user details
		.exec();
  
	  res.status(200).json({
		success: true,
		data: purchases,
	  });
	} catch (err) {
	  console.error("Error fetching purchased courses:", err);
	  res.status(500).json({
		success: false,
		message: "Could not fetch purchased courses",
	  });
	}
  };

const getPurchasedCoursesById =  async(req, res) => {
	try {
	  
	  // Fetch data with course and user details
	  const purchases = await PurchaseModel.findById(req.params.id)
		.populate("courseId", "courseName description") // Populate course details
		.populate("userId", "firstName mobileNo") // Populate user details
		.exec();
  
	  res.status(200).json({
		success: true,
		data: purchases,
	  });
	} catch (err) {
	  console.error("Error fetching purchased courses:", err);
	  res.status(500).json({
		success: false,
		message: "Could not fetch purchased courses",
	  });
	}
  };

const delete_purchase = async (req, res) => {
	try {

		const existingPurchase = await PurchaseModel.findById(req.params.id).lean();
	  
		if (!existingPurchase) {
			return res.status(404).json({ message: 'Buy not found' });
		}

		const existingPurchaseDelete = new PurchaseDeleteModel(existingPurchase)
		await existingPurchaseDelete.save();
		
		const CourseData = await PurchaseModel.findByIdAndDelete(req.params.id).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data.length != 0) {
				return apiResponse.successResponse(res, "Buy Deleted Sucessfully.");
			} else {
				return apiResponse.notFoundResponse(res, "Buy Not Found.");
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

const updatePurchaseForUser = async (req, res, next) => {
	try {
	  const { courseId, userId, purchaseDate, transactionId, amount, comment, paymentStatus } = req.body;
	  const { id } = req.params;  // Assuming the ID of the purchase to update is in the request params

  
	  // Check if the purchase exists for the given courseId and userId
	//   const existingPurchase = await PurchaseModel.findOne({ courseId, userId });
	  const existingPurchase = await PurchaseModel.findById(id);
  
	  if (!existingPurchase) {
		// If no existing purchase, return an error message
		return apiResponse.ErrorResponse(res, "Course not purchased by the user.");
	  }
	  console.log(amount);
	  
	  // If the purchase exists, update it
	  existingPurchase.purchaseDate = purchaseDate || existingPurchase.purchaseDate;
	  existingPurchase.transactionId = transactionId || existingPurchase.transactionId;
	  existingPurchase.amount = amount || existingPurchase.amount;
	  existingPurchase.comment = comment || existingPurchase.comment;
	  existingPurchase.paymentStatus = paymentStatus || existingPurchase.paymentStatus;
  
	  // Save the updated course purchase data
	  await existingPurchase.save();
  
	  return apiResponse.successResponseWithData(res, "Course updated successfully.", existingPurchase);
  
	} catch (err) {
	  console.log(err);
	  return apiResponse.ErrorResponse(res, err);
	}
  };
  


module.exports = { getPurchasedCourses, addCourseToUser, delete_purchase , getPurchasedCoursesById, updatePurchaseForUser}