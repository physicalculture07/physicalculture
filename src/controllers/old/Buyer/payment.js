// const bidModel = require("../../models/bidModel");
const apiResponse = require("../../helpers/apiResponse");
const payment =require("../../models/paymentModel");
const userData = require("../../models/UserModel")
const Razorpay = require('razorpay');


require('dotenv').config();

const createPayment =  async(req, res, next) => {

	const data = req.body;
    try {

        var instance = new Razorpay({
			key_id: 'rzp_live_sFN18XluYPw4q9',
			key_secret: 'SfBj7SSqK7PE7nAbeldXKfwz',
		})

		let obj={
			receipt :data.receipt,
			amount : (data.amount)*100,
			currency : data.currency,
		}

		const rozarResults =  await  instance.orders.create(obj);

		if(rozarResults){
			const results = new payment({
				userId: data.userId, 
				auctionId: data.auctionId, 
				rozarOrderId: rozarResults.id, 
				entity: rozarResults.entity,
				amount: rozarResults.amount,
				amount_paid: rozarResults.amount_paid,
				amount_due: rozarResults.amount_due,
				currency: rozarResults.currency,
				receipt: rozarResults.receipt,
				offer_id: rozarResults.offer_id,
				status: rozarResults.status,
				attempts: rozarResults.attempts
			});

			results.save(
				function (err) {
				if (err) { 
					return apiResponse.ErrorResponse(res, err); 
				}else{
					return apiResponse.successResponseWithData(res,"Payment Details.", {results});
				}
			});

		}else{
			return apiResponse.ErrorResponse(res, "something went wrong!"); 
		}			
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


module.exports = { createPayment}