// const BidModel = require("../../models/bidModel");
const auctionModel = require("../../models/auctionsModel");
const apiResponse = require("../../helpers/apiResponse");
const utility = require("../../helpers/utility");
const path = require('path');
const bidModel = require("../../models/bidModel");
const bidOrdersModel = require("../../models/bidOrderModel");
const sellerModel = require("../../models/SellerModel");
const TrackModel = require("../../models/TrackModel");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const ObjectId = require("mongodb").ObjectId;
const notificationModel = require("../../models/notification");

// const jwt = require("jsonwebtoken");

const ppp = require("../../helpers/pushNotification");


const createBid = async (req, res) => {

    try {
        const { userId, auctionId, sellerId, amount, sellerName } = req.body;

        // const authToken = req.headers.authorization;
        // const decoded = jwt.decode(authToken);

        // const auctionDetails = await auctionModel.findOne({'_id': new ObjectId(auctionId)}).then(function (auction, err) {
        // const auctionDetails = await auctionModel.findOne({'_id': auctionId}).then(function (auction, err) {
        const auctionDetails = await auctionModel.findById({ '_id': auctionId, 'userId': userId }).sort({ createdAt: 1 }).then(function (auction, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (auction) {
                console.log(auction.bidPrice, "bidprice")
                // console.log(amount)
                if (amount < auction.bidPrice) {
                    const bid = new bidModel({
                        userId: userId,
                        auctionId: auctionId,
                        sellerId: sellerId,
                        amount: amount,
                        sellerName: sellerName,
                        auctionStatus: "active"
                    });

                    bid.save(function (err) {
                        if (err) {
                            console.log(err, "1");
                            return apiResponse.ErrorResponse(res, err);
                        } else {

                            auction.bidPrice = amount;
                            auction.sellerId = sellerId;
                            auction.save(async function (err) {
                                if (err) {
                                    console.log(err, "2");
                                    return apiResponse.ErrorResponse(res, err);
                                } else {

                                    let receiverUserId = userId;
                                    let senderUserId = sellerId;

                                    const createNotification = new notificationModel({
                                        auctionId: auctionId,
                                        senderId: sellerId,
                                        senderRole: "Seller",
                                        receiverId: userId,
                                        receiverRole: "buyer",
                                        title: "Bid Created.",
                                        decription: "New bid created",
                                        type: "bid_applied",
                                        NotificationFor: "Bid",
                                        readStatus: 0,
                                        status: "active"
                                    });

                                    await createNotification.save();

                                    let userTrackData = await TrackModel.findOne({ buyerId: receiverUserId });
                                    console.log(userTrackData, "-->")
                                    // return;
                                    let fcmTokenArr = [];
                                    userTrackData.fcmToken ? fcmTokenArr.push(userTrackData.fcmToken) : fcmTokenArr;
                                    // console.log(userTrackData)
                                    if (fcmTokenArr.length > 0) {
                                        const registrationTokens = fcmTokenArr;
                                        var payload = {
                                            notification: {
                                                title: "Bid",
                                                body: "Bid added"
                                            }
                                            ,
                                            data: {
                                                SenderId: senderUserId.toString(),
                                                ReceiverId: receiverUserId.toString(),
                                                // Time: time.toString(),
                                                //NotificationLink: link,
                                                Slug: "create-bid",
                                                NotificationFor: "Bid",
                                                type: "bid_applied"
                                            }
                                        };
                                        var options = {
                                            priority: "high",
                                            // timeToLive: 60  60  24
                                        };

                                        const response = ppp.sendPush(registrationTokens, payload, options);
                                        console.log(response);

                                    }
                                    return apiResponse.successResponseWithData(res, "Bid Created.", bid);
                                }
                            });


                        }
                    });

                } else {

                    return apiResponse.validationErrorWithData(res, "minumun amount or sellerId is not same.", req.body);
                }

            } else {
                return apiResponse.notFoundResponse(res, "Auction not found.");
            }
        });

    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const myBidsSeller = async (req, res) => {

    try {

        const { sellerId, auctionStatus } = req.body;
        // const authToken = req.headers.authorization;
        // const decoded = jwt.decode(authToken);

        const bid = await auctionModel.find({ sellerId: sellerId, auctionStatus: auctionStatus }).sort({ createdAt: -1 }).then(function (bids, err) {
            if (err) {

                return apiResponse.ErrorResponse(res, err);

            } else if (bids) {


                let activeBids = [];

                bids.forEach((doc) => {
                    activeBids.push({
                        _id: doc._id,
                        auctionStatus: doc.auctionStatus,
                        bidPrice: doc.bidPrice,
                        category: doc.category,
                        description: doc.description,
                        originalPrice: doc.originalPrice,
                        productId: doc.productId,
                        productImage: doc.productImage,
                        productImageMobile: [{ path: doc.productImage }],
                        productName: doc.productName,
                        sellerId: doc.sellerId,
                        sendMobileNo: doc.sendMobileNo,
                        sendUserName: doc.sendUserName,
                        userAddress: doc.userAddress,
                        userId: doc.userId,
                        createdAt: doc.createdAt,
                        updatedA: doc.updatedA,
                    });
                });

                return apiResponse.successResponseWithData(res, "Active Seller Bids.", activeBids);

            } else {

                return apiResponse.notFoundResponse(res, "No Bid Found");

            }
        });



    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    }
}


const getMyOrder = async (req, res) => {

    try {

        const { sellerId } = req.body;
        // const authToken = req.headers.authorization;
        // const decoded = jwt.decode(authToken);

        const bid = await bidOrdersModel.find({ sellerId: sellerId }).then(function (bids, err) {
            if (err) {

                return apiResponse.ErrorResponse(res, err);

            } else if (bids.length > 0) {

                let activeBids = [];

                bids.forEach((doc) => {
                    activeBids.push({
                        _id: doc._id,
                        userId: doc.userId,
                        paymentId: doc.paymentId,
                        bidPrice: doc.bidPrice,
                        category: doc.category,
                        description: doc.description,
                        originalPrice: doc.originalPrice,
                        productId: doc.productId,
                        productImage: doc.productImage,
                        productImageMobile: [{ path: doc.productImage }],
                        productName: doc.productName,
                        sellerId: doc.sellerId,
                        sendMobileNo: doc.sendMobileNo,
                        sendUserName: doc.sendUserName,
                        userAddress: doc.userAddress,
                        status: doc.status,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,

                    });
                });

                return apiResponse.successResponseWithData(res, "My orders.", activeBids);

            } else {

                return apiResponse.successResponseWithData(res, "Not found My orders.", []);

            }
        });



    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    }
}

const getAllOrders = async (req, res) => {
    try {
        //   const {page,per_page} = req.body;

        //   const orderCount = await bidOrdersModel.countDocuments().exec();

        const orderDetails = await bidOrdersModel.find();

        if (orderDetails.length > 0) {

            /* paging
            const startIndex = (page-1) * per_page;
            const endIndex = page * per_page;

            const orderData = {};
            orderData.length = orderCount;
            orderData.data = orders.slice(startIndex,endIndex);*/

            const orderData = [];
            await Promise.all(orderDetails.map(async (data) => {
                let sellerData = await sellerModel.findOne({ _id: data.sellerId });

                orderData.push({
                    _id: data._id,
                    userId: data.userId,
                    paymentId: data.paymentId,
                    auctionId: data.auctionId,
                    category: data.category,
                    description: data.description,
                    originalPrice: data.originalPrice,
                    productId: data.productId,
                    productImage: data.productImage,
                    productName: data.productName,
                    bidPrice: data.bidPrice,
                    sellerId: data.sellerId,
                    sendMobileNo: data.sendMobileNo,
                    sendUserName: data.sendUserName,
                    userAddress: data.userAddress,
                    status: data.status,
                    sellerName: sellerData.sellerName
                });

            }));
            return apiResponse.successResponseWithData(res, "All Orders Found", orderData);
        } else {
            return apiResponse.notFoundResponse(res, "No Orders Found")
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { order_id, productId, status } = req.body;
        const orderData = await bidOrdersModel.findOne({ _id: order_id, productId }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data.length != 0) {
                data.status = status;
                data.save();
                return apiResponse.successResponseWithData(res, "Order Status Updated", data)
            } else {
                return apiResponse.notFoundResponse(res, "No Orders Found")
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}


const orderDelete = async (req, res) => {
    try {
        const { order_id } = req.body;
        const deleteOrder = await bidOrdersModel.findOneAndDelete({ _id: order_id }).then(function (delOrder, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (delOrder.length != 0) {
                return apiResponse.successResponse(res, "Order Deleted Sucessfully");
            } else {
                return apiResponse.notFoundResponse(res, "No Orders Found");
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}



module.exports = { createBid, myBidsSeller, getMyOrder, getAllOrders, updateOrderStatus, orderDelete }