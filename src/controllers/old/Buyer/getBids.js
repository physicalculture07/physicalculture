const bidModel = require("../../models/bidModel");
const apiResponse = require("../../helpers//apiResponse");
const bidOrdersModel =require("../../models/bidOrderModel");
const userModel = require("../../models/UserModel")
const mailer = require("../../helpers/mailer");
const { constants } = require("../../helpers/constants");
const notificationModel = require("../../models/notification");
require('dotenv').config()
const auctionsModel = require("../../models/auctionsModel");

const jwt = require("jsonwebtoken");


const getBids =  async(req, res, next) => {	



    try {
        
		const { auctionId } = req.body;
		
		
		const bidsDetails = await bidModel.find({auctionId}).sort({amount:1});
		if (bidsDetails.length!=0) {
			// console.log("bids",bidsDetails.so);
				return apiResponse.successResponseWithData(res,"get Bid.", bidsDetails);	
			
		}else{
			return apiResponse.unauthorizedResponse(res,"User not found.", "");
		}
		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


const createBidOrder =  async(req, res, next) => {

    try {
        
		const requestData = req.body;
		const createBidOrderData = new bidOrdersModel({
			
			"auctionId": requestData.auctionId,
			"bidId":requestData.bidId,
			"bidPrice":requestData.bidPrice,
			"category": requestData.category,
			"createdBy":requestData.createdBy,
			"description": requestData.description,
			"originalPrice": requestData.originalPrice,
			"productId": requestData.productId,
			"productImage": requestData.productImage,
			"productName": requestData.productName,
			"sellerId": requestData.sellerId,
			"sendMobileNo": requestData.sendMobileNo,
			"sendUserName": requestData.sendUserName,
			"status":requestData.status,
			"userAddress": requestData.userAddress,
			"userId": requestData.userId,
			"paymentId": requestData.paymentId
		});
		
		
		createBidOrderData.save(async function (err) {
			if (err) { 
				return apiResponse.ErrorResponse(res, err); 
			} else {				
				const auctionDetails = await auctionsModel.findById(requestData.auctionId);
                // console.log("-->",auctionDetails)
				auctionDetails.auctionStatus = "inactive";

				const delNotification = await notificationModel.findOneAndDelete({receiverId:requestData.userId});
                
				const userData = await userModel.findById(requestData.userId);

				let html = `<p><strong>Hi ${ userData.name } </strong></p><p> Your Order has been created successfully for ${auctionDetails.productName}</p>`;
                
				mailer.send(constants.confirmEmails.from, userData.email,"Order Created.",html);

				auctionDetails.save(function (err) {
					if (err) { 
						return apiResponse.ErrorResponse(res, err); 
					} else {
						return apiResponse.successResponseWithData(res,"create Bid Order Successfully.", createBidOrderData);
					}
				});
			}
		});

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}

const getOrderDetails=  async(req, res, next) => {



    try {
		const {userId  } = req.body;
		
		// const authToken = req.headers.authorization;
		// const decoded = jwt.decode(authToken);
		
		
		const bidsOrderDetails = await bidOrdersModel.find({userId :userId}).sort();
		// console.log("bids",bidsOrderDetails)
		if (bidsOrderDetails) {
			
			// if(auctionDetails.status) {

				// bidsOrderDetails.userId = userId;
			

				// bidsOrderDetails.save();

				return apiResponse.successResponseWithData(res,"get Bids Order.", {"results": bidsOrderDetails});
				
			// }else {
			// 	return apiResponse.unauthorizedResponse(res, "address not available.");
			// }	
			
		}else{
			return apiResponse.unauthorizedResponse(res,"User not found.", "");
		}
		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


module.exports = {  getBids,createBidOrder,getOrderDetails}