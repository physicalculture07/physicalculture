const masterCategoryModel = require("../../models/masterCategoryModel");
const productModel = require("../../models/productModel")
const apiResponse = require("../../../helpers/apiResponse");
const { s3Uploadv2 } = require('../../../service/s3_service');

require("dotenv").config();



const createMasterCategory = async (req, res, next) => {
  const file = req.files;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  try {
		const result = await s3Uploadv2(file);
    
    const data = req.body;
    data.image = result[0].Location;
    
    const createCategoryData = new masterCategoryModel(data);
    
    createCategoryData.save(function (err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else {
        return apiResponse.successResponseWithData(res,"Create Product Category Successfully.",createCategoryData);
      }
    });
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};

const getMasterCategory_backup = async (req, res, next) => {
  try {
    const categoryData = await masterCategoryModel.find({});

    if (categoryData.length > 0) {
      let categoryDatanew = [];

      categoryData.forEach((doc) => {
        categoryDatanew.push({
          _id: doc._id,
          name: doc.name,
          image: doc.image,
          imageMobile: [doc.image],
        });
      });
      return apiResponse.successResponseWithData(res, "Category List", { results: categoryDatanew });
    } else {
      return apiResponse.notFoundResponse(res, "Category not found");
    }
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};


const getMasterCategory = async (req, res, next) => {

  masterCategoryModel.aggregate([

    {
      $project: {
        "userObjId": { "$toString": "$_id" },
        name: 1,
        image: 1
      }
    },
    {
      $lookup: {
        from: "productcategories",
        localField: "userObjId",
        foreignField: "masterCategoryId",
        as: "productCats",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image: 1,
        // image :   { $concat: [ baseurl, "", "$image.path" ] },
        productCats: '$productCats',
      },
    }

  ]).then((result) => {
    return apiResponse.successResponseWithData(res, "Category List", { results: result });
  })
    .catch((err) => {
      return apiResponse.ErrorResponse(res, err);
    });

};

const getsingleMaster = async (req, res) => {
  try {
    const data = await masterCategoryModel.find({}).then(function (ele, err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else if (ele.length != 0) {
        return apiResponse.successResponseWithData(res, "Master Category is", ele);
      } else {
        return apiResponse.notFoundResponse(res, "Category not found");
      }
    })
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
}

const allproductBymastercategory = async (req, res) => {
  try {
    const { masterCategoryId, masterCategoryName } = req.body;
    const productData = await productModel.find({ masterCategoryId, masterCategoryName }).then(function (data, err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else if (data.length != 0) {
        return apiResponse.successResponseWithData(res, "All Products Found Successfully.", data);
      } else {
        return apiResponse.notFoundResponse(res, "No Products Found.");
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  };
};

module.exports = { createMasterCategory, getMasterCategory, allproductBymastercategory, getsingleMaster };
