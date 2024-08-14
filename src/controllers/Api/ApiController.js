const UserModel = require("../../models/UserModel");
const apiResponse = require("../../helpers/apiResponse");
// const utility = require("../../helpers/utility");
const jwt = require("jsonwebtoken");
// const mailer = require("../../helpers/mailer");
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



// const TrackModel = require("../../models/TrackModel");

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
		const { firstName, lastName} = req.body;
		
		const authToken = req.headers.authorization;
		const decoded = jwt.decode(authToken);
		
		
		const userDetails = await UserModel.findOne({_id : decoded.userId});
		
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
		return apiResponse.ErrorResponse(res, err);
	}
};

const login = async(req, res) => {
	const { mobileNo, password, deviceId } = req.body;

    try {
        // Check if the user exists
        const user = await UserModel.findOne({ mobileNo }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

		const userDevice = await UserModel.findOne({ mobileNo, deviceId });
		if (!userDevice) {
            return res.status(404).json({ message: 'Please login on same device or contact to app admin' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return token and user details
        res.status(200).json({ token, user: { _id: user._id, firstName: user.firstName, lastName: user.lastName } });
    } catch (error) {
		console.log(error);
        res.status(500).json({ message: 'Failed to login' });
    }
}

const getAllCourses = async (req, res, next) => {
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

const getClassByCourseId = async (req, res) => {
	try {
	  const classData = await ClassModel.find({courseId:req.params.id});
	  if (!classData) return apiResponse.notFoundResponse(res, "Class not found");
	  return apiResponse.successResponseWithData(res, "Class List.", classData);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};

const getAllPdfNotes = async (req, res, next) => {
	try {

		const pdfNotesModel = await PdfNotesModel.find().lean()

		if (pdfNotesModel.length > 0) {

			return apiResponse.successResponseWithData(res, "Notes List.", pdfNotesModel);
		} else {
			return apiResponse.notFoundResponse(res, "Notes not found");
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
			return apiResponse.notFoundResponse(res, "Previous Papers not found");
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
			return apiResponse.notFoundResponse(res, "Syllabus not found");
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
			return apiResponse.notFoundResponse(res, "Test Series not found");
		}

	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

module.exports = { signUp, login, userProfile, updateUserProfile, getAllCourses, getClassByCourseId, getAllPdfNotes, getAllPreviousPapers, getAllSyllabus, getAllTestSeries }