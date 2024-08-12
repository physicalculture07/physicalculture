const apiResponse = require('../../helpers/apiResponse');
const forumModel = require("../../models/forumModel");
const forumCategoryModel = require('../../models/forumCategoryModel');
const adminModel = require('../../models/adminModel');
const forumSocial = require('../../models/forumLikeComment');
const userModel = require('../../models/UserModel');
const jwt = require('jsonwebtoken');

//s3 bucket
const { s3Uploadv2 } = require('../../service/s3_service');

const addForumUser = async (req, res) => {
    const file = req.files;

    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    try {

        const result = await s3Uploadv2(file);
        const authToken = req.headers.authorization;
        const decoded = jwt.decode(authToken);

        const adminData = await adminModel.findOne({ _id: decoded._id });

        if (adminData) {
            let data = req.body;

            const catData = await forumCategoryModel.findOne({ _id: data.CategoryId });

            if (catData) {
                const ImageArr = [];
                result.forEach(item => {
                    ImageArr.push(item.Location)
                });

                data.Image = ImageArr;
                data.IsAdminAdded = true;
                data.IsLiked = false;

                const forumData = new forumModel(data);

                forumData.save(function (err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponse(res, "Forum Data Created Sucessfully.");
                    }
                });
            } else {
                return apiResponse.ErrorResponse(res, "Forum Category not Found.");
            }
        } else {
            let data = req.body;

            const catData = await forumCategoryModel.findOne({ _id: data.CategoryId });

            if (catData) {
                const ImageArr = [];
                result.forEach(item => {
                    ImageArr.push(item.Location)
                });

                data.Image = ImageArr;
                data.IsAdminAdded = false;
                data.IsLiked = false;

                const forumData = new forumModel(data);

                forumData.save(function (err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponse(res, "Forum Data Created Sucessfully.");
                    }
                });
            } else {

                return apiResponse.ErrorResponse(res, "Forum Category not Found.");
            }
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const addForumAdmin = async (req, res) => {
    const file = req.files;

    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    try {
        let data = req.body;

        const result = await s3Uploadv2(file);

        const adminData = await adminModel.findOne({ _id: data.AdminId });

        if (adminData) {

            const catData = await forumCategoryModel.findOne({ _id: data.CategoryId });

            if (catData) {
                const ImageArr = [];
                result.forEach(item => {
                    ImageArr.push(item.Location)
                });

                data.Image = ImageArr;
                data.IsAdminAdded = true;
                data.IsLiked = false;

                const forumData = new forumModel(data);

                forumData.save(function (err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponse(res, "Forum Data Created Sucessfully.");
                    }
                });
            } else {
                return apiResponse.ErrorResponse(res, "Forum Category not Found.");
            }
        } else {
            let data = req.body;

            const catData = await forumCategoryModel.findOne({ _id: data.CategoryId });

            if (catData) {
                const ImageArr = [];
                result.forEach(item => {
                    ImageArr.push(item.Location)
                })

                data.Image = ImageArr;
                data.IsAdminAdded = false;
                data.IsLiked = false;

                const forumData = new forumModel(data);

                forumData.save(function (err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponse(res, "Forum Data Created Sucessfully.");
                    }
                });
            } else {

                return apiResponse.ErrorResponse(res, "Forum Category not Found.");
            }
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getForumAdmin = async (req, res) => {
    try {
        await forumModel.find({}).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Forum data Get Sucessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "Forum Data Not Found.");
            }
        })

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const deleteForumAdmin = async (req, res) => {
    try {
        const { forumId } = req.body;

        await forumModel.findByIdAndRemove({ _id: forumId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                return apiResponse.successResponse(res, "Forum Data Deleted Sucessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "Forum Data Not Found.");
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

const changeStatus = async (req, res) => {
    try {
        const { forumId, Status } = req.body;

        await forumModel.findOne({ _id: forumId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                item.Status = Status
                item.save();

                return apiResponse.successResponse(res, "Forum Status Changed Sucessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "Forum Data Not Found.");
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

const getForumHome = async (req, res) => {
    try {

        const forumData = await forumModel.find({ Status: "Active" });


        const newForumDatas = [];
        forumData.forEach(item => {
            let ImageCount = item.Image.length;
            newForumDatas.push({
                _id: item._id,
                Title: item.Title,
                Description: item.Description,
                ShortDescription: item.ShortDescription,
                Category: item.Category,
                CategoryId: item.CategoryId,
                Image: item.Image,
                ImageLength: ImageCount,
                IsAdminAdded: item.IsAdminAdded,
                IsLiked: item.IsLiked,
                TotalLike: item.TotalLike,
                TotalComment: item.TotalComment,
                TotalShared: item.TotalShared,
                Status: item.Status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })
        })

        const newForumData = await forumModel.find({ Status: "Active" });

        const catData = await forumCategoryModel.find({}).select("Name");

        return apiResponse.successResponseWithData(res, "Forum Data Get Sucessfully.", { forumData: newForumDatas, New: newForumData, CategoryData: catData })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getForumSingle = async (req, res) => {
    try {
        const { forumId } = req.body;

        await forumModel.findOne({ _id: forumId }).then(async function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {

                const newForum = await forumModel.find({});

                const categoryData = await forumCategoryModel.find({}).select("Name");

                const releventContent = await forumModel.find({ CategoryId: item.CategoryId });

                const relData = {};

                relData.RelevantId = forumId;
                relData.ReleventData = releventContent;

                return apiResponse.successResponseWithData(res, "Forum Data Get Sucessfully.", { forumData: item, New: newForum, CategoryData: categoryData, RelevantContent: relData })
            } else {
                return apiResponse.notFoundResponse(res, "Forum Data Not Found.");
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const seeMore = async (req, res) => {
    try {
        const { categoryId } = req.body;

        await forumModel.find({ CategoryId: categoryId }).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Forum Data Get Sucessfully", data);
            } else {
                return apiResponse.notFoundResponse(res, "Forum Data Not Found.");
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const comment = async (req, res) => {
    try {

        const { forumId, comment, userId } = req.body;

        await forumModel.findOne({ _id: forumId }).then(async function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                item.TotalComment = item.TotalComment + 1;
                item.save();

                const userData = await userModel.findOne({ _id: userId });
                const datas = await forumSocial.findOne({ forumId: forumId });

                if (datas) {
                    datas.UserName = userData.name;
                    datas.TotalLike = datas.TotalLike;
                    datas.TotalComment.push(comment);
                    datas.save();

                    return apiResponse.successResponseWithData(res, "Comment Added Sucessfully.", datas);
                } else {

                    const newComments = forumSocial({
                        "UserName": userData.name,
                        "forumId": item._id,
                        "TotalLike": item.TotalLike,
                        "TotalComment": comment
                    });

                    newComments.save();
                    return apiResponse.successResponseWithData(res, "New Comment Added Sucessfully.", newComments);
                }
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const likeForum = async (req, res) => {
    try {
        const { forumId, like, userId } = req.body;

        await forumModel.findOne({ _id: forumId }).then(async function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {

                if (like == 0) {
                    item.IsLiked = false;
                    if (item.TotalLike == 0) {
                        item.TotalLike = item.TotalLike;
                        item.save();
                    } else {
                        item.TotalLike = item.TotalLike - 1;
                        item.save();
                    }
                } else {
                    item.IsLiked = true;
                    item.TotalLike = item.TotalLike + 1;
                    item.save();
                }


                const userData = await userModel.findOne({ _id: userId });
                const datas = await forumSocial.findOne({ forumId: forumId });


                if (datas) {
                    datas.UserName = userData.name;
                    datas.TotalLike = item.TotalLike;
                    datas.TotalComment = datas.TotalComment;
                    datas.save();

                    return apiResponse.successResponseWithData(res, "Like Added Sucessfully.", datas);
                } else {

                    const newComments = forumSocial({
                        "UserName": userData.name,
                        "forumId": item._id,
                        "TotalLike": item.TotalLike
                    });

                    newComments.save();
                    return apiResponse.successResponseWithData(res, "New Like Added Sucessfully.", newComments);
                }

            }
        });


    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

const getComment = async (req, res) => {
    try {
        const { forumId } = req.body;

        await forumSocial.findOne({ forumId: forumId }).select("TotalComment UserName").then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                return apiResponse.successResponseWithData(res, "Comment Get Sucessfully.", data);
            } else {
                return apiResponse.notFoundResponse(res, "Forum Data Not Found.");
            }
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

module.exports = { addForumAdmin, getForumAdmin, changeStatus, deleteForumAdmin, getForumHome, getForumSingle, seeMore, addForumUser, comment, likeForum, getComment };
