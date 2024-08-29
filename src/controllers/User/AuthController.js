const UserModel = require("../../models/UserModel");
const apiResponse = require("../../helpers/apiResponse");
// const utility = require("../../helpers/utility");
const jwt = require("jsonwebtoken");
// const mailer = require("../../helpers/mailer");
const path = require('path')
const { generateToken } = require('../../util/jwtUtils');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const bcrypt = require("bcryptjs");



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
		
		const {firstName, lastName, mobileNo, password} = req.body;
		otp = '123456';
		const existingUser = await UserModel.findOne({ $or: [{ mobileNo }] });
		
		if (existingUser) {
            return apiResponse.validationErrorWithData(res, 'Email or mobile number already exists');
        }
		const userType = 'admin';
		const newUser = new UserModel({
            firstName,
            lastName,
            mobileNo,
            password,
            otp,
			userType
        });

        // Save user to database
        await newUser.save();
		return apiResponse.successResponseWithData(res,"Registration Success.", newUser, 0);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

const login = async(req, res) => {
	const { mobileNo, password } = req.body;

    try {
        // Check if the user exists
        const user = await UserModel.findOne({ "mobileNo": mobileNo, "userType": "admin"}).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: "false",message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return token and user details
        res.status(200).json({ "token":token, status: "true"});
    } catch (error) {
		console.log(error);
        res.status(500).json({ message: 'Failed to login' });
    }
}

const getAllUsers = async (req, res) => {
	try {
		
	  	const allUsers = await UserModel.find();
	  	if (allUsers.length > 0) {
			return apiResponse.successResponseWithData(res, "Users List.", allUsers);
		} else {
			return apiResponse.notFoundResponse(res, "Users not found");
		}

	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

const updateUserStatus = async (req, res) => {
	let { id, status } = req.body;
  
	if (!id || !status) {
	  return res.status(400).json({ message: 'User ID and status are required' });
	}

	status = (status === 'true') ? true:false;
  
	try {
	  const user = await UserModel.findByIdAndUpdate(id, { status }, { new: true });
	  if (!user) {
		return res.status(404).json({ message: 'User not found' });
	  }
	  res.status(200).json({ message: 'User status updated successfully', data: user });
	} catch (error) {
	  res.status(500).json({ message: 'Error updating status', error });
	}
};

module.exports = { signUp, login, userProfile, updateUserProfile, getAllUsers, updateUserStatus}