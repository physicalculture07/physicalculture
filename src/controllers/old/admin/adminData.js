const adminModel = require("../../models/adminModel");
const apiResponse = require("../../helpers/apiResponse");

const bcrypt = require('bcryptjs');
require('dotenv').config();

const jwt = require("jsonwebtoken");


const expire = process.env.JWT_TIMEOUT_DURATION;
const jwt_key = process.env.JWT_SECRET;

const registerAdmin = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    const encrypted = await bcrypt.hash(password, 10);
    const adminData = new adminModel({
      name: name,
      email: email,
      address: address,
      password: encrypted,
    });
    adminData.save();

    return apiResponse.successResponseWithData(res, "Admin Registered Sucessfully.", adminData);
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminData = await adminModel.findOne({ email }).then(function (user, err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      }
      if (!user) {
        return apiResponse.successResponseforAdmin(res, "Incorrect UserName.")
      }
      else if (bcrypt.compareSync(password, user.password)) {

        const dataExist = {
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          password: user.password
        }

        const jwtPayload = dataExist;
        const jwtData = { expiresIn: expire };
        dataExist.token = jwt.sign(jwtPayload, jwt_key, jwtData);

        return apiResponse.successResponseWithData(res, "Admin Login and Token Generated Sucessfully.", dataExist);
      } else {
        return apiResponse.successResponseforAdmin(res, "Incorrect Password.")
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res.err);
  }
};

const getAdmindata = async (req, res) => {
  try {
    const authToken = req.headers.authorization;
    // console.log("-->",authToken)
    const decoded = jwt.decode(authToken);
    // console.log(decoded)
    const data = await adminModel.findOne({ _id: decoded.user._id });
    // console.log("data ",data)
    if (data.length != 0) {
      return apiResponse.successResponseWithData(res, "Admin Data is..", data);
    } else {
      return apiResponse.notFoundResponse(res, "No Admin Data Found.");
    }
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
}

module.exports = { registerAdmin, loginAdmin, getAdmindata };
