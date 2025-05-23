const UserModel = require("../../models/UserModel");
const apiResponse = require("../../helpers/apiResponse");
const jwt = require("jsonwebtoken");
const path = require('path')
const { generateToken } = require('../../util/jwtUtils');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const bcrypt = require("bcryptjs");
const CourseModel = require("../../models/CourseModel");
const ClassModel = require("../../models/ClassModel");
const PdfNotesModel = require("../../models/PdfNotesModel");
const PreviousPaperModel = require("../../models/PreviousPaperModel");
const SyllabusModel = require("../../models/SyllabusModel");
const TestSeriesModel = require("../../models/TestSeriesModel");
const PurchaseModel = require("../../models/PurchaseModel");
const BannerModel = require("../../models/BannerModel");
const NewsModel = require("../../models/NewsModel");
const ObjectId = require("mongoose").Types.ObjectId;

const twilio = require('twilio');
const ChapterModel = require("../../models/ChapterModel");

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Get from Twilio Console
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;  // Get from Twilio Console
const client = twilio(accountSid, authToken);



// const TrackModel = require("../../models/TrackModel");

const userProfile = async(req, res) => {
	
	try {
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);
		// console.log("decode data is",decoded);

		const userDetails = await UserModel.findOne({_id : decoded._id});
		
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
		const { firstName, lastName} = req.body;
		
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);
		
		
		const userDetails = await UserModel.findOne({_id : decoded._id});
		
		if (userDetails) {
			
			if(userDetails.status) {

				userDetails.firstName = firstName;
				userDetails.lastName = lastName;

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


const signUp = async(req, res) => {
	
	try {
		
		const {firstName, lastName, mobileNo, password, deviceId} = req.body;
		console.log("body------",req.body);
		otp = '123456';
		const existingUser = await UserModel.findOne({ $or: [{ mobileNo }] });
		
		if (existingUser) {
            return apiResponse.validationErrorWithData(res, 'Email or mobile number already exists');
        }
		const newUser = new UserModel({
            firstName,
            lastName,
            mobileNo,
            password,
            otp,
            deviceId
        });

        // Save user to database
        await newUser.save();
		return apiResponse.successResponseWithData(res,"Registration Success.", newUser, 0);
	} catch (err) {
		console.log(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

const login = async(req, res) => {
	const { mobileNo, password, deviceId } = req.body;
	console.log("body------",req.body);

    try {
        // Check if the user exists
        let user = await UserModel.findOne({ mobileNo });

        if (!user) {
            // return res.status(404).json({ message: 'User not found' });
			return apiResponse.validationErrorWithData(res, "User not found", {}, 0)
        }else if(!user.status){
			return apiResponse.validationErrorWithData(res, "Account is deactive, please contact to Admin", {}, 0)
		}

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // return res.status(401).json({ message: 'Invalid credentials' });
			return apiResponse.validationErrorWithData(res, "Invalid credentials", {}, 0)
        }

		if(user.deviceId == null){
			user.deviceId = deviceId;
			await user.save();
		}



		// if (user.deviceId != deviceId) {
        //     // return res.status(404).json({ message: 'Please login on same device or contact to app admin' });
		// 	return apiResponse.validationErrorWithData(res, "Please login on same device or contact to app admin", {}, 0)
        // }

		if(!user.isMobileVerified){
			// otp sent logic goes here
			let gotp = generateOTP();
			user.otp = gotp;
			user.save();
			sendOTP(`'+91'${mobileNo}`, gotp);

			return apiResponse.successResponseWithData(res,"please verify your mobile number", {is_otp: false}, 0);
			
		}

        // Generate JWT token
		user = user.toObject();
        const token = generateToken(user);

        // Return token and user details
		return apiResponse.successResponseWithData(res,"login Success.", data={token, user: { _id: user._id, firstName: user.firstName, lastName: user.lastName }, is_otp:true}, 0);
    } catch (error) {
		console.log(error);
        // res.status(500).json({ message: 'Failed to login' });
		return apiResponse.validationErrorWithData(res, "Failed to login", {}, 0)
    }
}

const verifyOtp = async(req, res, next) => {
	try {
		const { mobileNo, otp, deviceId } = req.body;

		console.log("otp 00--", req.body);
		
		
		// const checkUserExists =await UserModel.findOne({ mobileNo, deviceId });
		const checkUserExists =await UserModel.findOne({ mobileNo });
		console.log("otp---1", checkUserExists);
		
		
		if (checkUserExists) {
			console.log("otp---2", checkUserExists);
			
			if(checkUserExists.status) {
				console.log("otp---3", checkUserExists);
				
				if(checkUserExists.otp == otp){
					console.log("otp---4", checkUserExists);
					if(!checkUserExists.isMobileVerified){
						console.log("otp---5", checkUserExists);
						checkUserExists.isMobileVerified = 1;
						await checkUserExists.save();

					}
					const user = checkUserExists.toObject();
					const token = generateToken(user);
					console.log("otp---6", checkUserExists);
					// Return token and user details
					return apiResponse.successResponseWithData(res,"login Success.", data={token, user: { _id: user._id, firstName: user.firstName, lastName: user.lastName }, is_otp:false}, 0);

				}else{
					console.log("otp---7", "Please enter correct otp");
					return apiResponse.unauthorizedResponse(res, "Please enter correct otp.");
				}
			}else {
				console.log("otp---8", "Account is not active. Please contact admin.");
				return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
			}	
			
		}else{
			console.log("otp---9", "User not found.");
			return apiResponse.successResponse(res,"User not found.", "");
		}
		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}

const getAllCourses = async (req, res, next) => {
	try {
		//   const { userId } = req.params; // Assuming `userId` is passed as a URL parameter
		const token = req.headers.authorization;
		const decoded = jwt.decode(token);
		const userId = decoded._id;
		const userObjectId = new ObjectId(userId);
	
		// Aggregate courses with purchase details specific to the user
		const CourseData = await CourseModel.aggregate([
			{
				$lookup: {
					from: "purchases",
					let: { courseId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$courseId", "$$courseId"] },
										{ $eq: ["$userId", userObjectId] }
									]
								}
							}
						}
					],
					as: "userPurchases"
				}
			},
			{
				$addFields: {
					is_purchase: {
						$cond: {
							if: { $gt: [{ $size: "$userPurchases" }, 0] },
							then: true,
							else: false
						}
					}
				}
			},
			{
				$project: {
					courseName: 1,
					courseFees: 1,
					courseValidity: 1,
					courseImage: 1,
					is_purchase: 1,
					// userPurchases: 1 // Optionally include or exclude detailed user purchase information
				}
			}
		]);
  
	  if (CourseData.length > 0) {
		return apiResponse.successResponseWithData(res, "Course List with User Purchase Details.", CourseData);
	  } else {
		return apiResponse.notFoundDataSucessResponse(res, "Course not found");
	  }
  
	} catch (err) {
	  console.log(err);
	  return apiResponse.ErrorResponse(res, err);
	}
};

const getAllChapters = async (req, res, next) => {
	try {
		//   const { userId } = req.params; // Assuming `userId` is passed as a URL parameter
		const token = req.headers.authorization;
		const decoded = jwt.decode(token);
		const userId = decoded._id;
		const userObjectId = new ObjectId(userId);
	
		// Aggregate courses with purchase details specific to the user
		const ChapterData = await ChapterModel.aggregate([
			{
				$lookup: {
					from: "purchases",
					let: { chapterId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$chapterId", "$$chapterId"] },
										{ $eq: ["$userId", userObjectId] }
									]
								}
							}
						}
					],
					as: "userPurchases"
				}
			},
			{
				$addFields: {
					is_purchase: {
						$cond: {
							if: { $gt: [{ $size: "$userPurchases" }, 0] },
							then: true,
							else: false
						}
					}
				}
			},
			{
				$project: {
					chpaterName: 1,
					chpaterFees: 1,
					chpaterImage: 1,
					is_purchase: 1,
					// userPurchases: 1 // Optionally include or exclude detailed user purchase information
				}
			}
		]);
  
	  if (ChapterData.length > 0) {
		return apiResponse.successResponseWithData(res, "Chapter List with User Purchase Details.", ChapterData);
	  } else {
		return apiResponse.notFoundDataSucessResponse(res, "Chapter not found");
	  }
  
	} catch (err) {
	  console.log(err);
	  return apiResponse.ErrorResponse(res, err);
	}
};

const getAllChaptersByCourse = async (req, res, next) => {
	try {
		const {courseId} = req.body;
		const ChapterData = await ChapterModel.find({"courseId":courseId}).lean()

		if (ChapterData.length > 0) {

			return apiResponse.successResponseWithData(res, "Chapter List.", ChapterData);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "Chapter not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

  
const getClassByCourseId = async (req, res) => {
	try {
	  const classData = await ClassModel.find({courseId:req.params.id});
	  if (!classData) return apiResponse.notFoundResponse(res, "Class not found");
	  return apiResponse.successResponseWithData(res, "Class List.", classData);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	  return apiResponse.validationErrorWithData(res, err.message, {}, 0)
	}
};

const getChapterClassByCourseId = async (req, res) => {
	try {
	  const { chapterId, courseId } = req.body;
	  const classData = await ClassModel.find({courseId:courseId, chapterId:chapterId});
	  if (!classData) return apiResponse.notFoundResponse(res, "Class not found");
	  return apiResponse.successResponseWithData(res, "Class List.", classData);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	  return apiResponse.validationErrorWithData(res, err.message, {}, 0)
	}
};

const getAllPdfNotes = async (req, res, next) => {
	try {

		const pdfNotesModel = await PdfNotesModel.find().lean()

		if (pdfNotesModel.length > 0) {

			return apiResponse.successResponseWithData(res, "Notes List.", pdfNotesModel);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "Notes not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getAllPreviousPapers = async (req, res, next) => {
	try {

		const previousPaperModel = await PreviousPaperModel.find().lean()

		if (previousPaperModel.length > 0) {

			return apiResponse.successResponseWithData(res, "Previous Papers List.", previousPaperModel);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "Previous Papers not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getAllSyllabus = async (req, res, next) => {
	try {

		const syllabusModel = await SyllabusModel.find().lean()

		if (syllabusModel.length > 0) {

			return apiResponse.successResponseWithData(res, "Syllabus List.", syllabusModel);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "Syllabus not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getAllTestSeries = async (req, res, next) => {
	try {

		const testSeriesModel = await TestSeriesModel.find().lean()

		if (testSeriesModel.length > 0) {

			return apiResponse.successResponseWithData(res, "Test Series List.", testSeriesModel);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "Test Series not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const forgotPassword = async (req, res, next) => {
	const { mobileNo, deviceId } = req.body;
	

    try {
        // Check if the user exists
        const user = await UserModel.findOne({ mobileNo }).lean();

        if (!user) {
            // return res.status(404).json({ message: 'User not found' });
			return apiResponse.notFoundUserResponse(res, "User not found", {}, 0)
        }

		const userDevice = await UserModel.findOne({ mobileNo });
		// if (!userDevice) {
        //     // return res.status(404).json({ message: 'Please login on same device or contact to app admin' });
		// 	return apiResponse.notFoundUserResponse(res, "Please login on same device or contact to app admin", {}, 0)
        // }

		
			// otp sent logic goes here
		let gotp = generateOTP()
		userDevice.otp = gotp;
		userDevice.save();
		sendOTP(`'+91'${mobileNo}`, gotp);
		return apiResponse.successResponseWithData(res,"otp sent sucessfully", 0);
		
        // Generate JWT token
        
    } catch (error) {
		console.log(error);
        // res.status(500).json({ message: 'Failed to login' });
		return apiResponse.validationErrorWithData(res, "Failed to login", {}, 0)
    }
}

const resetPassword = async (req, res, next) => {
	const { mobileNo, password, confirm_password, deviceId } = req.body;

    try {
        // Check if the user exists

		if(password != confirm_password){
			
			// return res.status(404).json({ message: 'please enter same password' });
			return apiResponse.validationErrorWithData(res, "please enter same password", {}, 0)
			
		}
        const user = await UserModel.findOne({ mobileNo }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

		const userDevice = await UserModel.findOne({ mobileNo, deviceId });
		if (!userDevice) {
            // return res.status(404).json({ message: 'Please login on same device or contact to app admin' });
			return apiResponse.validationErrorWithData(res, "Please login on same device or contact to app admin", {}, 0)
        }

		// otp sent logic goes here
		userDevice.password = password;
		userDevice.save();

		return apiResponse.successResponseWithData(res,"password reset sucessfully, please login", 0);
		
        // Generate JWT token
        
    } catch (error) {
		console.log(error);
        // res.status(500).json({ message: 'Failed to login' });
		return apiResponse.validationErrorWithData(res, "Failed to login", {}, 0)
    }
}

const buyCourse = async (req, res, next) => {

	const {courseId, userId, transactionId, deviceId } = req.body;
	
	const course = await CourseModel.findById(courseId);
	if (!course) {
	  return apiResponse.validationErrorWithData(res, "Course not found", {}, 0)
	}
  
	const purchase = new PurchaseModel({
	  courseId: course._id,
	  userId: userId,
	  paymentStatus: "Completed",  // or "Pending" initially
	  transactionId: transactionId,
	  deviceId:deviceId
	});
  
	await purchase.save();
	return apiResponse.successResponseWithData(res,"You have sucessfully bought the course", 0);
}

const getAllBanners = async (req, res, next) => {
	try {

		const BannerData = await BannerModel.find().lean()

		if (BannerData.length > 0) {

			return apiResponse.successResponseWithData(res, "Banner List.", BannerData);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "Banner not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const downloadClassVideo = async (req, res, next) => {
	try {
	  const { classId, isClassVideoDownloaded } = req.body;
	  
  
	  const existingClass = await ClassModel.findById(classId);
	  if (!existingClass) {
		// return res.status(404).json({ message: 'Class not found' });
		return apiResponse.validationErrorWithData(res, "Class not found", {}, 0)
	  }
  
	  // Update courseId and className if provided
	  if (isClassVideoDownloaded) existingClass.isClassVideoDownloaded = isClassVideoDownloaded;

	  const updatedClass = await existingClass.save();
	  return apiResponse.successResponseWithData(res, "Class List.", updatedClass);
	} catch (error) {
	//   res.status(500).json({ message: error.message });
	  return apiResponse.validationErrorWithData(res, error.message, {}, 0)
	}
};

const contactUs = async (req, res, next) => {
	try {

	  const updatedClass = {
		"email": "physicalculture07@gmail.com",
		"contactNumber":"9649383886",
		"description":"To buy any course, please contact on this number"
	  }
	  return apiResponse.successResponseWithData(res, "Contact Us .", updatedClass);
	} catch (error) {
	//   res.status(500).json({ message: error.message });
	  return apiResponse.validationErrorWithData(res, error.message, {}, 0)
	}
};

async function sendOTP(to, otp) {
	try {
	  const message = await client.messages.create({
		body: `Your OTP is ${otp}. Please use this to verify your account.`,
		from: '+1(775) 551-7344', // Replace with your Twilio number
		to: to, // Indian number, e.g., +919876543210
	  });
	  console.log('OTP Sent:', message.sid);
	} catch (error) {
	  console.error('Error sending OTP:', error.message);
	}
  }
//   sendOTP('+918619252075', '112233');

const getAllNews = async (req, res, next) => {
	try {

		const newsModel = await NewsModel.find().lean()

		if (newsModel.length > 0) {

			return apiResponse.successResponseWithData(res, "News List.", newsModel);
		} else {
			return apiResponse.notFoundDataSucessResponse(res, "News not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};



module.exports = { signUp, login, verifyOtp, userProfile, updateUserProfile, getAllCourses, getClassByCourseId, getAllPdfNotes, getAllPreviousPapers, getAllSyllabus, getAllTestSeries, forgotPassword, resetPassword, buyCourse, getAllBanners, downloadClassVideo, contactUs, getAllNews, getChapterClassByCourseId, getAllChapters,getAllChaptersByCourse }