const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse");
const UserModel = require('../models/UserModel');
dotenv.config();

const isAuth = async(req, res, next) => {

    // let tokenheaderkey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET;

    try {
        const token = req.headers.authorization;
        const deviceId = req.headers.deviceid;

        if (!token) {
            // return res.status(401).json({ message: 'No token provided' });
            return apiResponse.validationErrorWithData(res, "No token provided", {}, 0)
        }
        if (!deviceId) {
            // return res.status(401).json({ message: 'Device not registered' });
            return apiResponse.validationErrorWithData(res, "Device not registered", {}, 0)
        }

        const verified = jwt.verify(token, jwtSecretKey);

        if (verified) {
            // const user = await UserModel.findOne({ "deviceId": verified.deviceId, "_id": verified._id}).lean();
            
            // if (!user) {
            //     return res.status(404).json({ message: 'Invalid device' });
            // }

            if(deviceId != verified.deviceId){
                // return res.status(404).json({ message: 'Invalid device' });
                return apiResponse.successResponseforAdmin(res, "Invalid device.");
            }
            next();
        } else {
            return apiResponse.unauthorizedResponse(res, "Invalid token.");
        }
    } catch (err) {
        // Access Denied
        console.log(err);
        return apiResponse.successResponseforAdmin(res, "JWT expired.");
    }
}

const isSameDevice = (req, res, next) => {
    // Get token from headers
    const deviceId = req.headers['deviceId'];

    if (!deviceId) {
        return res.status(401).json({ message: 'Device not registered' });
    }


};

module.exports = { isAuth }