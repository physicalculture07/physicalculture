const apiResponse = require('../../../helpers/apiResponse');
const forumCategoryModel = require('../../models/forumCategoryModel');

const addForum = async (req, res) => {
    try {
        const { Name, Status } = req.body;

        var forumData = new forumCategoryModel({
            "Name": Name,
            "Status": Status
        });

        forumData.save(function (err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else {
                return apiResponse.successResponseWithData(res, "Forum Category Data Add Sucessfully.", forumData);
            }
        });
        /*
        const { Name, Status } = req.body;

        const authToken = req.headers.authorization;
        const decoded = jwt.decode(authToken);

        const adminData = await adminModel.findOne({ _id: decoded._id });

        if (adminData) {
            let IsAdmin = true
            var forumData = new forumModel({
                "Name": Name,
                "Status": Status,
                "IsAdmin": IsAdmin
            });
            forumData.save(function (err) {
                if (err) {
                    return apiResponse.ErrorResponse(res, err);
                } else {
                    return apiResponse.successResponseWithData(res, "Forum Category Data Add Sucessfully.", forumData);
                }
            });
        } else {
            let IsAdmin = false
            var forumData = new forumModel({
                "Name": Name,
                "Status": Status,
                "IsAdmin": IsAdmin
            });
            forumData.save(function (err) {
                if (err) {
                    return apiResponse.ErrorResponse(res, err);
                } else {
                    return apiResponse.successResponseWithData(res, "Forum Category Data Add Sucessfully.", forumData);
                }
            });
        }*/
    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const getForumCategory = async (req, res) => {
    try {
        await forumCategoryModel.find({ Status: "Active" }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Forum Category Data Get Sucessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "Forum Category Data Not Found.");
            };
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const changeStatus = async (req, res) => {
    try {
        const { forumId, Status } = req.body;

        await forumCategoryModel.findOne({ _id: forumId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                item.Status = Status;
                item.save();

                return apiResponse.successResponse(res, "Forum Category Status Changed Sucessfully.");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const forumCategoryDelete = async (req, res) => {
    try {
        const { forumCatId } = req.body;

        await forumCategoryModel.findByIdAndRemove({ _id: forumCatId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                return apiResponse.successResponse(res, "Forum Category Delete Sucessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "Forum Category Not Found.");
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

module.exports = { addForum, getForumCategory, changeStatus, forumCategoryDelete };