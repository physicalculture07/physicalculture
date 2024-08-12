const categoryModel = require("../../models/auctionsModel");
const apiResponse = require("../../helpers//apiResponse");
const multer = require('multer')
const users = require("../../util/config_firebase")
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const NotificationModel = require("../../models/notification");
const auctionModel = require("../../models/auctionsModel");
const bidModel = require("../../models/bidModel");
const sellerModel = require("../../models/SellerModel")

const TrackModel = require("../../models/TrackModel");
const ppp = require("../../helpers/pushNotification");

// const notificationModel = require("../../models/notification");

const createAuction = async (req, res, next) => {

	try {
		// const data  = req.body;
		const { auctionStatus, bidPrice, category, description, originalPrice, productId, productImage, productName, sellerId, sendMobileNo, sendUserName, userAddress, userId } = req.body;


		const isAuctionExist = await categoryModel.find({ productId: productId, auctionStatus: 'active', userId: userId });

		if (isAuctionExist.length > 0) {
			return apiResponse.validationErrorWithData(res, "Auction already existed.", '');
		} else {

			const createCategoryData = new categoryModel({

				"auctionStatus": auctionStatus,
				"bidPrice": bidPrice,
				"category": category,
				"description": description,
				"originalPrice": originalPrice,
				"productId": productId,
				"productImage": productImage,
				"productName": productName,
				"sellerId": sellerId,
				"sendMobileNo": sendMobileNo,
				"sendUserName": sendUserName,
				"userAddress": userAddress,
				"userId": userId
			});

			await createCategoryData.save();

			const auctionDetails = await auctionModel.findOne({ _id: createCategoryData._id });

			const sellerData = await sellerModel.findOne({ sellerId });
			if (auctionDetails.length != 0) {
				if (auctionDetails.bidPrice < auctionDetails.originalPrice) {
					const bid = new bidModel({
						auctionId: auctionDetails._id,
						userId: auctionDetails.userId,
						sellerId: auctionDetails.sellerId,
						amount: auctionDetails.bidPrice,
						userAddress: auctionDetails.userAddress,
						auctionStatus: auctionDetails.auctionStatus,
						sellerName: sellerData.sellerName
					});
					await bid.save(); // bid created
				}
			}
			if (createCategoryData.length != 0) {

				let receiverUserId = sellerId;
				let senderUserId = userId;
				// console.log(userTrackData);
				const createNotification = new NotificationModel({
					auctionId: auctionDetails._id,
					senderId: userId,
					senderRole: "buyer",
					receiverId: sellerId,
					receiverRole: "seller",
					title: "Create Auction",
					decription: "New auction created. Start bidding...",
					type: "auction_created",
					NotificationFor: "CreateAuction",
					readStatus: 0,
					status: "active"
				});
                
				await createNotification.save();
				let userTrackData = await TrackModel.findOne({ sellerId: receiverUserId });
                // console.log(userTrackData)
				if(userTrackData.length > 0){
					let fcmTokenArr = [];
					userTrackData.fcmToken ? fcmTokenArr.push(userTrackData.fcmToken) : fcmTokenArr;

					if (fcmTokenArr.length > 0) {
						const registrationTokens = fcmTokenArr;
						var payload = {
							notification: {
								title: "Create Auction",
								body: "New auction created. Start bidding..."
							}
							,
							data: {
								SenderId: senderUserId.toString(),
								ReceiverId: receiverUserId.toString(),
								// Time: time.toString(),
								//NotificationLink: link,
								Slug: "create-auction",
								NotificationFor: "CreateAuction",
								type: "auction_created"
							}
						};
						var options = {
							priority: "high",
							// timeToLive: 60  60  24
						};

						const response = ppp.sendPush(registrationTokens, payload, options);
						console.log("-->",response);

					}
				}
				
				return apiResponse.successResponseWithData(res, "create Auction Successfully.", createCategoryData);
			} else {
				return apiResponse.ErrorResponse(res, err);
			}

		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


const getAuction = async (req, res, next) => {



	// try {
	// 	const { userId } = req.body;

	// console.log(userId);


	// 	const auctionDetails = await categoryModel.findOne({userId :userId});
	// 	console.log(auctionDetails)
	// 	if (auctionDetails) {

	// 		// if(auctionDetails.status) {

	// 			auctionDetails.userId = userId;


	// 			auctionDetails.save();

	// 			return apiResponse.successResponseWithData(res,"get Auction.", auctionDetails);

	// 		// }else {
	// 		// 	return apiResponse.unauthorizedResponse(res, "auction not available.");
	// 		// }	

	// 	}else{
	// 		return apiResponse.unauthorizedResponse(res,"User not found.", "");
	// 	}


	// } catch (err) {
	// 	console.log(err)
	// 	return apiResponse.ErrorResponse(res, err);
	// }



	try {
		const { userId } = req.body;

		const auctionDetail = await categoryModel.find({ userId: userId }).sort({createdAt:-1}).then(function (auctionDetails, err) {
			if (err) {
				
				return apiResponse.ErrorResponse(res, err);
				
			} else if (auctionDetails.length > 0) {
				
				// console.log(auctionDetails)
				return apiResponse.successResponseWithData(res, "get auctionDetails..", auctionDetails);

			} else {

				return apiResponse.successResponseWithData(res, "No auctionDetails Found", []);

			}
		});


	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


// const allAuction = await categoryModel.find().then(function(auction, err){
const getAllauction = async (req, res, next) => {
	try {
		const allAuction = await categoryModel.find().then(function (auction, err) {
			if (err) {

				return apiResponse.ErrorResponse(res, err);

			} else if (auction.length > 0) {

				return apiResponse.successResponseWithData(res, "Get All Auctions", auction);

			} else {

				return apiResponse.successResponse(res, "No Auctions Found");

			}
		});

	} catch (err) {
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
}

const updateAuctionStatus = async (req, res, next) => {
	try {
		const { auction_id, userId, auctionStatus } = req.body;
		const auctionData = await categoryModel.findOne({ _id: auction_id, userId }).then(function (aucData, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (aucData.length != 0) {
				aucData.auctionStatus = auctionStatus;
				aucData.save();
				return apiResponse.successResponseWithData(res, "Auction Status Updated Successfully.", aucData);
			} else {
				return apiResponse.notFoundResponse(res, "No Auction Details Found.");
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
}

const auctionDelete = async (req, res, next) => {
	try {
		const { auction_id, userId } = req.body;
		const delNotification = await NotificationModel.findOneAndDelete({receiverId:userId});
		const auctionDetail = await categoryModel.findOneAndDelete({ _id: auction_id, userId }).then(function (data, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (data.length != 0) {
				return apiResponse.successResponse(res, "Auction Deleted")
			} else {
				return apiResponse.notFoundResponse(res, "No Auction Found")
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
}

module.exports = { createAuction, getAuction, getAllauction, updateAuctionStatus, auctionDelete }