const mailer = require("../../helpers/mailer");
const { constants } = require("../../helpers/constants");
const apiResponse = require('../../helpers/apiResponse');
const productModel = require("../../models/productModel");

const subscribeEmail = async (req, res) => {
    try {

        const { email } = req.body;


        let html = `<p><strong>Hi </strong></p><p> Your account has been subscribed successfully on Bidders Price.</p>`;

        // Send subscribe Email
        mailer.send(constants.confirmEmails.from, email, "Account Subscription", html).then(function (data) {
            return apiResponse.successResponseWithData(res, "Email has been sent sucessfully.", data);
        }).catch(err => {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const updateBrandId = async (req, res) => {
    try {
        await productModel.find({ brand: "Samsung" }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {

                data.forEach(element => {
                    console.log(element);
                    element.brand_id = "63e4b449b6a287eea9919f71"
                    element.save();
                });

                return apiResponse.successResponseWithData(res, "Products,", data);
            } else {
                return apiResponse.notFoundResponse(res, "Products not found");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

module.exports = { subscribeEmail, updateBrandId };