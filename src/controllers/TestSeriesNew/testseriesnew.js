const TestSeriesNewModel = require('../../models/TestSeriesNewModel')
const apiResponse = require("../../helpers/apiResponse");
const { deleteFileFromS3 } = require('../../helpers/fileUploader');
require('dotenv').config();


const createNewTestSeries = async (req, res, next) => {


    try {

        const {title, price, isFree, description} = req.body;
        const image = req.files['image'] ? req.files['image'][0].key : null;
        const NewTestSeriesData = new TestSeriesNewModel({title : title, price: price, isFree: isFree, image: image, description:description});
        await NewTestSeriesData.save()
        return apiResponse.successResponseWithData(res, "Test Series Created.", NewTestSeriesData);
    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    }
}

const getNewTestSeries = async (req, res, next) => {
    try {

        const NewTestSeriesData = await TestSeriesNewModel.find().lean()

        if (NewTestSeriesData.length > 0) {

            return apiResponse.successResponseWithData(res, "Test Series List.", NewTestSeriesData);
        } else {
            return apiResponse.notFoundResponse(res, "Test series not found");
        }

    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const getNewTestSeriesbyId = async (req, res, next) => {
    try {

        const NewTestSeriesData = await TestSeriesNewModel.findById(req.params.id).lean()

        if (NewTestSeriesData) {

            return apiResponse.successResponseWithData(res, "Test series List.", NewTestSeriesData);
        } else {
            return apiResponse.notFoundResponse(res, "Test series not found");
        }

    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const deleteNewTestSeries = async (req, res) => {
    try {
        // const { NewTestSeries_id } = req.body;

        const existingNewTestSeries = await TestSeriesNewModel.findById(req.params.id);
      
        if (!existingNewTestSeries) {
            return res.status(404).json({ message: 'NewTestSeries not found' });
        }
    
        // Delete associated files from S3
        if (existingNewTestSeries.image) {
            await deleteFileFromS3(existingNewTestSeries.image);
        }

        const NewTestSeriesData = await TestSeriesNewModel.findByIdAndDelete(req.params.id).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data.length != 0) {
                return apiResponse.successResponse(res, "NewTestSeries Deleted Sucessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "NewTestSeries Not Found.");
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

const updateNewTestSeries = async (req, res) => {
    
    try {
        
        const {title, price,isFree, description } = req.body;
        const image = req.files['image'] ? req.files['image'][0].key : null;
        await TestSeriesNewModel.findById(req.params.id).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                // data.title = title;
                if (title) data.title = title;
                if (price) data.price = price;
                if (isFree) data.isFree = isFree;
                if (image) data.image = image;
                if (description) data.description = description;

                data.save();

                return apiResponse.successResponseWithData(res, "NewTestSeries Data Updated SUcessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "NewTestSeries Data Not Found.");
            }
        });
    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    }
}

module.exports = { createNewTestSeries, getNewTestSeries, deleteNewTestSeries, updateNewTestSeries, getNewTestSeriesbyId }