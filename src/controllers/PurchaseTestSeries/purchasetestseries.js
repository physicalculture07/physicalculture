const PurchaseTestSeiesModel = require('../../models/UserPurchaseTest')

const apiResponse = require("../../helpers/apiResponse");
const PurchaseDeleteTestSeriesModel = require('../../models/PurchaseDeleteTestSeriesModel');
require('dotenv').config();


const addTestSeriesToUser = async (req, res, next) => {


	try {

		const {seriesId,userId,transactionId, amount, comment, paymentStatus} = req.body;

		const existingPurchase = await PurchaseTestSeiesModel.findOne({ seriesId, userId });

		if (existingPurchase) {
		  return apiResponse.ErrorResponse(res, "TestSeries already purchased by the user.");
		}


		const TestSeriesData = new PurchaseTestSeiesModel({seriesId : seriesId,userId:userId,transactionId : transactionId,amount : amount,comment : comment,paymentStatus : paymentStatus});
		await TestSeriesData.save()
		return apiResponse.successResponseWithData(res, "TestSeries Created.", TestSeriesData);
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const getPurchasedTestSeries =  async(req, res) => {
	try {
	  const {
		userId,
		seriesId,
		paymentStatus,
		startDate,
		endDate,
		minAmount,
		maxAmount,
	  } = req.query;
  
	  // Build the query dynamically
	  const query = {};
  
	  if (userId) query.userId = userId;
	  if (seriesId) query.seriesId = seriesId;
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
	  const purchases = await PurchaseTestSeiesModel.find(query)
		.populate("seriesId", "title description") // Populate course details
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

const getPurchasedTestSeriesById =  async(req, res) => {
	try {
	  
	  // Fetch data with course and user details
	  const purchases = await PurchaseTestSeiesModel.findById(req.params.id)
		.populate("seriesId", "title description") // Populate course details
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

		const existingPurchase = await PurchaseTestSeiesModel.findById(req.params.id).lean();
	  
		if (!existingPurchase) {
			return res.status(404).json({ message: 'Buy not found' });
		}

		const existingPurchaseDelete = new PurchaseDeleteTestSeriesModel(existingPurchase)
		await existingPurchaseDelete.save();
		
		const TestSeriesData = await PurchaseTestSeiesModel.findByIdAndDelete(req.params.id).then(function (data, err) {
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
	  const { seriesId, userId, purchaseDate, transactionId, amount, comment, paymentStatus } = req.body;
	  const { id } = req.params;  // Assuming the ID of the purchase to update is in the request params

  
	  // Check if the purchase exists for the given seriesId and userId
	//   const existingPurchase = await PurchaseTestSeiesModel.findOne({ seriesId, userId });
	  const existingPurchase = await PurchaseTestSeiesModel.findById(id);
  
	  if (!existingPurchase) {
		// If no existing purchase, return an error message
		return apiResponse.ErrorResponse(res, "TestSeries not purchased by the user.");
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
  
	  return apiResponse.successResponseWithData(res, "TestSeries updated successfully.", existingPurchase);
  
	} catch (err) {
	  console.log(err);
	  return apiResponse.ErrorResponse(res, err);
	}
  };
  


module.exports = { getPurchasedTestSeries, addTestSeriesToUser, delete_purchase , getPurchasedTestSeriesById, updatePurchaseForUser}