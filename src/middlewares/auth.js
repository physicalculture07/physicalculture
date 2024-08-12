const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const apiResponse = require("../helpers/apiResponse");
dotenv.config();

const isAuth = (req, res, next) => {

    let tokenheaderkey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET;

    try {
        const token = req.headers.authorization;
        const verified = jwt.verify(token, jwtSecretKey);
        // console.log(verified)
        if (verified) {
            next();
        } else {
            return apiResponse.unauthorizedResponse(res, "Invalid token.");
        }
    } catch (err) {
        // Access Denied
        return apiResponse.successResponseforAdmin(res, "JWT expired.");
    }
}

module.exports = { isAuth }