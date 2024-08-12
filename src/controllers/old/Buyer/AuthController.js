const UserModel = require("../../models/UserModel");
// const { body,validationResult, sanitizeBody } = require("express-validator");
// const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../../helpers/apiResponse");
const utility = require("../../helpers/utility");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../../helpers/mailer");
const { constants } = require("../../helpers/constants");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const testNo = process.env.TWILIO_REGISTERED_NO_TEST;

const client = require('twilio')(accountSid, authToken);

const TrackModel = require("../../models/TrackModel");
const NotificationModel = require("../../models/notification");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 *
exports.register = [
	// Validate fields.
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return UserModel.findOne({email : value}).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//hash input password
				bcrypt.hash(req.body.password,10,function(err, hash) {
					// generate OTP for confirmation
					let otp = utility.randomNumber(4);
					// Create User object with escaped and trimmed data
					var user = new UserModel(
						{
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email,
							password: hash,
							confirmOTP: otp
						}
					);
					// Html email body
					let html = "<p>Please Confirm your Account.</p><p>OTP: "+otp+"</p>";
					// Send confirmation email
					mailer.send(
						constants.confirmEmails.from, 
						req.body.email,
						"Confirm Account",
						html
					).then(function(){
						// Save user.
						user.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							let userData = {
								_id: user._id,
								firstName: user.firstName,
								lastName: user.lastName,
								email: user.email
							};
							return apiResponse.successResponseWithData(res,"Registration Success.", userData);
						});
					}).catch(err => {
						console.log(err);
						return apiResponse.ErrorResponse(res,err);
					}) ;
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 *
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({email : req.body.email}).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password,user.password,function (err,same) {
							if(same){
								//Check account confirmation.
								if(user.isConfirmed){
									// Check User's account active or not.
									if(user.status) {
										let userData = {
											_id: user._id,
											firstName: user.firstName,
											lastName: user.lastName,
											email: user.email,
										};
										//Prepare JWT token for authentication
										const jwtPayload = userData;
										const jwtData = {
											expiresIn: process.env.JWT_TIMEOUT_DURATION,
										};
										const secret = process.env.JWT_SECRET;
										//Generated JWT token with Payload and secret.
										userData.token = jwt.sign(jwtPayload, secret, jwtData);
										return apiResponse.successResponseWithData(res,"Login Success.", userData);
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								}else{
									return apiResponse.unauthorizedResponse(res, "Account is not confirmed. Please confirm your account.");
								}
							}else{
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					}else{
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Verify Confirm otp.
 *
 * @param {string}      email
 * @param {string}      otp
 *
 * @returns {Object}
 *
exports.verifyConfirm = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("otp").isLength({ min: 1 }).trim().withMessage("OTP must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("otp").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				var query = {email : req.body.email};
				UserModel.findOne(query).then(user => {
					if (user) {
						//Check already confirm or not.
						if(!user.isConfirmed){
							//Check account confirmation.
							if(user.confirmOTP == req.body.otp){
								//Update user as confirmed
								UserModel.findOneAndUpdate(query, {
									isConfirmed: 1,
									confirmOTP: null 
								}).catch(err => {
									return apiResponse.ErrorResponse(res, err);
								});
								return apiResponse.successResponse(res,"Account confirmed success.");
							}else{
								return apiResponse.unauthorizedResponse(res, "Otp does not match");
							}
						}else{
							return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
						}
					}else{
						return apiResponse.unauthorizedResponse(res, "Specified email not found.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Resend Confirm otp.
 *
 * @param {string}      email
 *
 * @returns {Object}
 *
exports.resendConfirmOtp = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	sanitizeBody("email").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				var query = {email : req.body.email};
				UserModel.findOne(query).then(user => {
					if (user) {
						//Check already confirm or not.
						if(!user.isConfirmed){
							// Generate otp
							let otp = utility.randomNumber(4);
							// Html email body
							let html = "<p>Please Confirm your Account.</p><p>OTP: "+otp+"</p>";
							// Send confirmation email
							mailer.send(
								constants.confirmEmails.from, 
								req.body.email,
								"Confirm Account",
								html
							).then(function(){
								user.isConfirmed = 0;
								user.confirmOTP = otp;
								// Save user.
								user.save(function (err) {
									if (err) { return apiResponse.ErrorResponse(res, err); }
									return apiResponse.successResponse(res,"Confirm otp sent.");
								});
							});
						}else{
							return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
						}
					}else{
						return apiResponse.unauthorizedResponse(res, "Specified email not found.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

*/
const sendOtp1 = async(req, res, next) => {
	
	try {
		const { mobNo } = req.body;
		
		const checkUserExists = await UserModel.findOne({mobNo : mobNo});
		console.log(checkUserExists);
		if (checkUserExists) {
			
			if(checkUserExists.status) {
				let otp = utility.randomNumber(4);
				checkUserExists.otp = otp;
        		await checkUserExists.save();

				client.messages.create({
					body: otp,
					from: testNo,
					to: mobNo
				}).then()
				.catch(function (error) {
					if (error.code === 21614) {
						console.log("Uh oh, looks like this caller can't receive SMS messages.")
					}
				})
				.done();

				return apiResponse.successResponseWithData(res,"Otp sent.", checkUserExists);
			}else {
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
		}else{
			
			let otp = utility.randomNumber(4);
			const user = new UserModel(
				{
					mobNo: mobNo,
					otp: otp
				}
			);
			user.save();

			client.messages.create({
				body: otp,
				from: testNo,
				to: mobNo
			}).then()
			.catch(function (error) {
				if (error.code === 21614) {
					console.log("Uh oh, looks like this caller can't receive SMS messages.")
				}
			})
			.done();

			return apiResponse.successResponseWithData(res,"otp sent.", user);
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const sendOtp = async(req, res, next) => {
	
	try {
		const { mobNo } = req.body;
		// console.log(mobNo,"mobno")
		// return;
		const checkUserExists = await UserModel.findOne({mobNo : mobNo});
		
		if (checkUserExists) {
			
			if(checkUserExists.status) {

				// if(checkUserExists.isMobileVerified){

					let otp = utility.randomNumber(4);
					checkUserExists.otp = otp;
					await checkUserExists.save();
					
					let url = 'www.biddersprice.com';
					client.messages.create({
						body: otp + ` is your verification code for ` + url,
						from: testNo,
						to: mobNo
					}).then()
					.catch(function (error) {
						if (error.code === 21614) {
							console.log("Uh oh, looks like this caller can't receive SMS messages.")
						}
					})
					.done();

					return apiResponse.successResponseWithData(res,"Otp sent.", checkUserExists, 0);
					
				// }else{
				// 	return apiResponse.unauthorizedResponse(res, "Please verify your mobile number.");
				// }
				
			}else {
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
		}else{
			return apiResponse.validationErrorWithData(res,"Mobile Number does not Registered",0);
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const reSendOtp = async(req, res, next) => {
	
	try {
		const { mobNo } = req.body;
		
		const checkUserExists = await UserModel.findOne({mobNo : mobNo});
		let url = 'www.biddersprice.com';
		if (checkUserExists) {
			
			if(checkUserExists.status) {
				let otp = utility.randomNumber(4);
				checkUserExists.otp = otp;
        		await checkUserExists.save();

				client.messages.create({
					body: checkUserExists.otp + ` is your verification code for ` + url,
					from: testNo,
					to: mobNo
				}).then()
				.catch(function (error) {
					if (error.code === 21614) {
						console.log("Uh oh, looks like this caller can't receive SMS messages.")
					}
				})
				.done();

				return apiResponse.successResponseWithData(res,"Otp sent.", checkUserExists, 0);
			}else {
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
		}else{

			return apiResponse.successResponse(res,"User not found.");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const verifyOtp = async(req, res, next) => {
	try {
		const { mobNo , otp } = req.body;

		const deviceToken = '';
		const fcmToken = req.body.fcmToken;
		const type = req.body.type;
		if(fcmToken == null || type == null){
			return apiResponse.validationErrorWithData(res,"fcm or type required.", '');
		}
		
		const checkUserExists = await UserModel.findOne({mobNo : mobNo});
		
		if (checkUserExists) {
			
			if(checkUserExists.status) {
				
				if(checkUserExists.otp == otp){

					if(!checkUserExists.isMobileVerified){

						checkUserExists.isMobileVerified = 1;
						checkUserExists.save();

					}

					const checkUserTrackExists = await TrackModel.findOne({buyerId : checkUserExists._id, deviceToken: deviceToken});
						
					if(checkUserTrackExists){
						checkUserTrackExists.fcmToken = fcmToken;
						checkUserTrackExists.save();
					}else{
						
						const buyerTrack = new TrackModel(
							{
								sellerId: '',
								buyerId: checkUserExists._id,
								fcmToken: fcmToken,
								deviceToken: deviceToken,
								type: type
							}
						);
						buyerTrack.save();
					}
					
					let userData = {
						_id: checkUserExists._id,
						userId: checkUserExists._id,
						mobNo: checkUserExists.mobNo,
						name: checkUserExists.name,
						email: checkUserExists.email,
						gender: checkUserExists.gender,
						isMobileVerified: checkUserExists.isMobileVerified,
						status: checkUserExists.status
					};
					//Prepare JWT token for authentication
					const jwtPayload = userData;
					const jwtData = {
						expiresIn: process.env.JWT_TIMEOUT_DURATION,
					};
					const secret = process.env.JWT_SECRET;
					//Generated JWT token with Payload and secret.
					userData.token = jwt.sign(jwtPayload, secret, jwtData);
					const tkn = userData.token;
					return apiResponse.successResponseWithData(res,"Login Success.", userData);
				}else{
					return apiResponse.unauthorizedResponse(res, "Please enter correct otp.");
				}
			}else {
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
			
		}else{
			return apiResponse.successResponse(res,"User not found.", "");
		}
		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const userProfile = async(req, res) => {
	
	try {
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);
		// console.log("decode data is",decoded);

		const userDetails = await UserModel.findOne({_id : decoded.userId});
		
		if (userDetails) {
			
			if(userDetails.status) {

				return apiResponse.successResponseWithData(res,"User Profile.", userDetails);
				
			}else {
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
			
		}else{
			return apiResponse.unauthorizedResponse(res,"User not found.", "");
		}
		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const updateUserProfile = async(req, res) => {
	
	try {
		const { email, name, gender } = req.body;
		
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);
		
		
		const userDetails = await UserModel.findOne({_id : decoded.userId});
		
		if (userDetails) {
			
			if(userDetails.status) {

				userDetails.email = email;
				userDetails.name = name;
				userDetails.gender = gender;

				userDetails.save();

				return apiResponse.successResponseWithData(res,"User profile updated.", userDetails);
				
			}else {
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
			
		}else{
			return apiResponse.unauthorizedResponse(res,"User not found.", "");
		}
		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const register = async(req, res) => {
	
	try {
		
		const {name, mobNo, email, gender} = req.body;

		const userExists = await UserModel.findOne({mobNo : mobNo}).then((user) => {
			// console.log("user is",user)
			if (user) {
				return apiResponse.validationErrorWithData(res, "Mobile No. already in use");
			}else{
				let url = 'www.biddersprice.com';
				let otp = utility.randomNumber(4);
				const user = new UserModel(
					{
						mobNo: mobNo,
						name: name,
						email: email,
						gender: gender,
						otp: otp,
					}
				);
				user.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let userData = {
						_id: user._id,
						name: user.name,
						mobNo: user.mobNo,
						email: user.email,
						gender: user.gender,
						otp: user.otp,
						isMobileVerified: user.isMobileVerified,
						status: user.status
					};

					client.messages.create({
						body: user.otp + ` is your verification code for ` + url,
						from: testNo,
						to: mobNo
					}).then()
					.catch(function (error) {
						if (error.code === 21614) {
							console.log("Uh oh, looks like this caller can't receive SMS messages.")
						}
					})
					.done();

					let html = `<p><strong>Hi ${ user.name } </strong></p><p> Your account has been registered successfully.</p><p> Please enter the otp from your phone and you'll be able to enjoy all services.`;
					// Send confirmation email
					mailer.send(constants.confirmEmails.from, user.email,"Account Registration",html).then().catch(err => {
						console.log(err);
						return apiResponse.ErrorResponse(res,err);
					}) ;

					return apiResponse.successResponseWithData(res,"Registration Success.", userData, 0);
				});
			}
		});

	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

const getUserData = async (req,res)=>{
	try{

		const getData = await UserModel.find().then(function(getdata,err){
			if(err){
				return apiResponse.ErrorResponse(res,err);
			}else if(getdata.length > 0){
				return apiResponse.successResponseWithData(res,"User Profile Details",getdata);
			}else{
				return apiResponse.notFoundResponse(res,"No User Details Found")
			}
		});

	}catch(err){
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}

const notificationList = async(req,res)=>{
	try{
    	
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);
		const notificationListing = await NotificationModel.find({receiverId: decoded._id, receiverRole: "buyer"});
        const countNotification = notificationListing.length;

		if(notificationListing.length > 0){
			return apiResponse.successResponseWithData(res,"Notification List",{"notificationList": notificationListing,countNotification});
		}else{
			return apiResponse.notFoundResponse(res,"Notification not found")
		}
	
	}catch(err){
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
}

const notificationRead = async(req,res)=>{
	try{
    	const {notificationId} = req.body;
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);

		const notificationListing = await NotificationModel.find({receiverId: decoded._id, receiverRole: "buyer", _id: notificationId});

		if(notificationListing.length > 0){
			notificationListing.readStatus = 1;
			await notificationListing.save();
			return apiResponse.successResponseWithData(res,"Notification read status updated",{"notificationList": notificationListing});
		}else{
			return apiResponse.successResponse(res,"Notification not found")
		}
	
	}catch(err){
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
}

module.exports = { sendOtp, verifyOtp, reSendOtp, userProfile, updateUserProfile, register, getUserData, notificationList, notificationRead }