const categoryModel = require("../../models/categoryModel");
const apiResponse = require("../../helpers//apiResponse");
require("dotenv").config();
const baseurl = process.env.BASE_URL;

const { s3Uploadv2 } = require('../../service/s3_service');

const createCategory = async (req, res) => {
  const file = req.files;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  try {

    const result = await s3Uploadv2(file);

    const data = req.body;
    data.categoryImage = result[0].Location;
    const createCategoryData = new categoryModel(data);

    createCategoryData.save(function (err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else {
        return apiResponse.successResponseWithData(res, "Product Category Create Successfully.", createCategoryData);
      }
    });
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const categoryData = await categoryModel.find({});

    if (categoryData.length > 0) {
      let categoryDatanew = [];

      categoryData.forEach((doc) => {
        categoryDatanew.push({
          _id: doc._id,
          productCategoryId: doc._id,
          categoryType: doc.categoryType,
          masterCategoryId: doc.masterCategoryId,
          // categoryImage: baseurl + doc.categoryImage.path,
          categoryImageFile: doc.categoryImage,
          categoryImageMobile: [doc.categoryImage],
        });
      });

      return apiResponse.successResponseWithData(res, "Category List", categoryDatanew);
    } else {
      return apiResponse.notFoundResponse(res, "Category not found");
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};

const getCategoryByMasterId = async (req, res, next) => {
  try {
    const { masterCategoryId } = req.body;
    const categoryData = await categoryModel.find({ 'masterCategoryId': masterCategoryId });

    if (categoryData.length > 0) {
      let categoryDatanew = [];

      categoryData.forEach((doc) => {
        categoryDatanew.push({
          _id: doc._id,
          categoryName: doc.categoryType,
          masterCategoryId: doc.masterCategoryId,
          categoryImage: baseurl + doc.categoryImage.path,
          categoryImageFile: doc.categoryImage,
          categoryImageMobile: [doc.categoryImage],

        });
      });
      return apiResponse.successResponseWithData(res, "Category List", { "results": categoryDatanew });
    } else {
      return apiResponse.notFoundResponse(res, "Category not found");
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id, categoryType } = req.body;
    const catData = await categoryModel.findOneAndDelete({ _id: category_id, categoryType }).then(function (data, err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else if (data.length != 0) {
        return apiResponse.successResponse(res, "Product-Category Deleted Sucessfully.")
      } else {
        return apiResponse.notFoundResponse(res, "Product-Category Not Found");
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
}

const categoryUpdate = async (req, res) => {
  const file = req.files;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  try {
    const { productCategoryId, categoryType } = req.body;

    const result = await s3Uploadv2(file);

    await categoryModel.findOne({ _id: productCategoryId }).then(function (item, err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else if (item) {
        
        item.categoryType = categoryType;
        item.categoryImage = result[0].Location;
        item.save();

        return apiResponse.successResponseWithData(res, "Category Data Updated Sucessfully.", item);

      } else {
        return apiResponse.notFoundResponse(res, "Category Data Not Found");
      }
    })
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
}

module.exports = { categoryUpdate, createCategory, getCategory, getCategoryByMasterId, deleteCategory };
