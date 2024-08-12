const productCategories = require('../../models/categoryModel');
const apiResponse = require('../../helpers/apiResponse');
const homeSlideModel = require('../../models/homeSlidesModel');
const productModel = require('../../models/productModel');

//s3 bucket
const { s3Uploadv2 } = require('../../service/s3_service');

const searchMasterData = async (req, res) => {
    try {
        const data1 = await productCategories.find({ masterCategoryId: "63bff3379d2989c8f25a2e20" });
        const data2 = await productCategories.find({ masterCategoryId: "63bec34f06ec5d04589d7aa6" });
        const data3 = await productModel.find().limit(10);

        let obj = {
            cat1: { CategoryName: "Home Appliances", "CategoryData": data1, },
            cat2: { CategoryName: "Laptop Accessories", "CategoryData": data2 },
            cat3: { CategoryName: "Trending Now", "CategoryData": data3 }
        }

        if (data1 || data2) {
            return apiResponse.successResponseWithData(res, "Data Get Sucessfully.", obj);
        } else {
            return apiResponse.notFoundResponse(res, "Data Not Found.");
        };
    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const createHomeSlides = async (req, res) => {
    const file = req.files;
    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }

    try {
        const data = req.body;
        const result = await s3Uploadv2(file);
        data.Image = result[0].Location;

        const homeSlidesData = new homeSlideModel(data);

        homeSlidesData.save(function (err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else {
                return apiResponse.successResponseWithData(res, "Home Slide Data Created.", homeSlidesData);
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getHomeSlides = async (req, res) => {
    try {
        await homeSlideModel.find({}).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {

                let obj = {};

                let discountData = { key: "Free Delivery on orders over Rs.200. Don't miss discount." };

                obj.BestPrice = data[0];
                obj.HotDeal = data[1];
                obj.OurExclusive = data[2];
                obj.discount = discountData;

                return apiResponse.successResponseWithData(res, "Home Slide Data Get Sucessfully.", obj);
            } else {
                return apiResponse.notFoundResponse(res, "No Home Slide Data Found.");
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};


module.exports = { searchMasterData, createHomeSlides, getHomeSlides };