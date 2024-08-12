const apiResponse = require('../../../helpers/apiResponse');
const blogCategoryModel = require('../../models/blogCategoryModel');


const addCategory = async (req, res) => {
    try {
        const { Name, Status } = req.body;

        const blogCatgeoryData = new blogCategoryModel({
            "Name": Name,
            "Status": Status
        });

        blogCatgeoryData.save(function (err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else {
                return apiResponse.successResponseWithData(res, "Blog Category Data Created Sucessfully.", blogCatgeoryData);
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

const getBlogCategory = async (req, res) => {
    try {
        await blogCategoryModel.find({}).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Blog Catgegory Data Get Sucessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "Blog Category Data Not Found.");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const changeStatus = async (req, res) => {
    try {
        const { blogCategoryId, Status } = req.body;

        await blogCategoryModel.findOne({ _id: blogCategoryId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {

                item.Status = Status;
                item.save();

                return apiResponse.successResponse(res, "Blog Category Data Updated Sucessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "Blog Category Data Not Found.");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

module.exports = { addCategory, getBlogCategory, changeStatus }