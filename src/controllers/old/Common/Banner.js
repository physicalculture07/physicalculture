const BannerModel = require('../../models/bannerModel');
const apiResponse = require('../../helpers/apiResponse');
const { s3Uploadv2 } = require('../../service/s3_service');

const createBanner = async (req, res) => {
    const file = req.files;

    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    try {
        const result = await s3Uploadv2(file);

        const data = req.body;
        data.BannerImage = result[0].Location;

        const bannerData = new BannerModel(data);

        bannerData.save(function (err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else {
                return apiResponse.successResponseWithData(res, "Banner Data Created Sucessfully.", bannerData);
            };
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};


const getBanner = async (req, res) => {
    try {
        await BannerModel.find({}).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Banner Data Get Sucessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "Banner Data Not Found.");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const updateBanner = async (req, res) => {
    try {
        const { bannerId, title, content, price, bidPrice } = req.body;
        // console.log(bannerId, "id");

        await BannerModel.findOne({ _id: bannerId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                item.bidPrice = bidPrice;
                item.title = title;
                item.price = price;
                item.content = content;

                item.save(function (err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponse(res, "Banner Data Updated Sucessfully.");
                    }
                });

            } else {
                return apiResponse.notFoundResponse(res, "Banner Data not found.");
            }
        });

    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};



module.exports = { createBanner, getBanner, updateBanner };