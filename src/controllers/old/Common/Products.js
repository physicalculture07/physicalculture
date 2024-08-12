const productModel = require("../../models/productModel")
const apiResponse = require("../../../helpers/apiResponse");
const brandModel = require('../../models/brandModel');
const productCategoriesModel = require('../../models/categoryModel');
require("dotenv").config();
const baseurl = process.env.BASE_URL;

const filterCategory = async (req, res) => {
  try {
    await productCategoriesModel.find({}).then(function (data, err) {
      if (err) {
        return apiResponse.ErrorResponse(res, err);
      } else if (data) {
        return apiResponse.successResponseWithData(res, "Categories Data Get Sucessfully.", data);
      } else {
        return apiResponse.notFoundResponse(res, "Categories Data Not Found.");
      };
    });

  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  };
};

const filterProducts = async (req, res) => {
  try {
    const { masterCategoryId, productCategory_id, brand_id, product_Id } = req.body;

    const filter = {};

    if (product_Id != null && product_Id != '') {
      filter['_id'] = product_Id;
    }

    if (masterCategoryId != null && masterCategoryId != '') {
      filter['masterCategoryId'] = masterCategoryId;
    }

    if (productCategory_id != null && productCategory_id != '') {
      filter['productCategory_id'] = productCategory_id;
    }

    if (brand_id != null && brand_id != '') {
      filter['brand_id'] = brand_id;
    }

    // const orderCount = await productModel.countDocuments().exec(); 
    const productDetail = await productModel.find(filter).then(async function (productDetails, err) {
      if (err) {

        return apiResponse.ErrorResponse(res, err);

      } else if (productDetails.length > 0) {

        const minimumBidPrice = await productModel.findOne(filter, { bidPrice: 1 }).sort({ bidPrice: 1 });
        const maximumBidPrice = await productModel.findOne(filter, { bidPrice: 1 }).sort({ bidPrice: -1 });

        var subCategoryName = {};
        let results = [];

        const minimumBidPrice1 = minimumBidPrice.bidPrice;
        const maximumBidPrice1 = maximumBidPrice.bidPrice;

        if (filter.brand_id != null && filter.brand_id != '') {
          subCategoryName.title = 'Speciality-Store';
          subCategoryName.brand = productDetails[0].brand;
        }

        if (filter.masterCategoryId != null && filter.masterCategoryId != '') {
          subCategoryName.title = productDetails[0].masterCategoryName;
          subCategoryName.brand = productDetails[0].productCategory;
        }

        if (filter.productCategory_id != null && filter.productCategory_id != '') {
          subCategoryName.title = productDetails[0].masterCategoryName;
          subCategoryName.brand = productDetails[0].productCategory;
        }

        // console.log(productDetails);
        productDetails.forEach((doc, index) => {
          results.push({
            _id: doc._id,
            productCategory_id: doc.productCategory_id,
            masterCategoryId: doc.masterCategoryId,
            masterCategoryName: doc.masterCategoryName,
            originalPrice: doc.originalPrice,
            bidPrice: doc.bidPrice,
            sellerId: doc.sellerId,
            prodouctDetails: doc.prodouctDetails,
            productCategory: doc.productCategory,
            productName: doc.productName,
            brand: doc.brand,
            brand_id: doc.brand_id,
            prdouctInfo: doc.prdouctInfo,
            // file: doc.file,
            singleImage: doc.file[0],
            productImages: doc.file,
          });

        });
        // const startIndex = (page - 1) * per_page;
        // const endIndex = page * per_page;

        // const orderData = {};
        // orderData.length = orderCount;
        // orderData.data = results.slice(startIndex,endIndex);

        return apiResponse.successResponseWithData(res, "get Products..", { results, minimumBidPrice1, maximumBidPrice1, subCategoryName });

      } else {

        return apiResponse.successResponseWithData(res, "No Products Found", []);

      }
    });


  } catch (err) {
    console.log(err)
    return apiResponse.ErrorResponse(res, err);
  };
};

const searchProducts = async (req, res) => {
  try {

    // await productCategoriesModel.find({}).then(function (data, err) {
    //   if (err) {
    //     return apiResponse.ErrorResponse(res, err);
    //   } else if (data) {
    //     return apiResponse.successResponseWithData(res, "Search Data Get Sucessfully.", data);
    //   } else {
    //     return apiResponse.notFoundResponse(res, "Searched Data Not Found.");
    //   }
    // });


    const searchKey = (req.query.searchKey);

    // console.log(searchKey, "searchkey");

    // if(searchKey)
    const data = searchKey.split(" ");

    if (data.length > 2) {
      var key1 = searchKey;
    } else {
      var key1 = data[0];
      var key2 = data[1];
    }
    // console.log(key1,key2,"wqdfbn")
    // return;

    let objSearch1 = [];
    let objSearch2 = [];

    if (key1) {
      objSearch1 = [
        {
          "brandName": { $regex: key1, $options: 'i' },
          "productName": { $regex: key1, $options: 'i' },
        }
      ];
    }


    if (typeof (key2) != 'undefined') {
      objSearch2 = [
        {
          "brand": { $regex: key1, $options: 'i' },
          "productCategory": { $regex: key2, $options: 'i' },
          "categoryType": { $regex: key2, $options: 'i' },
        }
      ];
    }

    // if (objSearch2.length != 0) {
    //   console.log(objSearch2, "objsearch2");
    //   console.log(objSearch1, "objsearch1");
    // }
    // return;


    if (objSearch1) {

      if (objSearch1.length != 0) {

        const searchData1 = await brandModel.find({ $or: objSearch1 });
        const searchData3 = await productModel.find({ $or: objSearch1 });

        if (objSearch2.length != 0) {
          var searchData2 = await productCategoriesModel.find({ $or: objSearch2 });
        }

        const searchData = [];

        if (searchData1) {
          searchData1.forEach(item => {
            searchData.push({
              brand_Id: item._id,
              searchName: item.brandName
            });
          });
        }

        if (searchData2) {
          searchData2.forEach(item => {
            searchData.push({
              productCategory_id: item._id,
              searchName: item.categoryType
            });
          });
        }

        if (searchData3) {
          searchData3.forEach(item => {
            searchData.push({
              searchName: item.productName,
              product_Id: item._id,
              brand_Id: item.brand_id,
              productCategory_id: item.productCategory_id,
              originalPrice: item.originalPrice,
              bidPrice: item.bidPrice,
              sellerId: item.sellerId,
              prodouctDetails: item.prodouctDetails,
              productCategory: item.productCategory,
              productName: item.productName,
              brand: item.brand,
              prdouctInfo: item.prdouctInfo,
              file: item.file,
              masterCategoryId: item.masterCategoryId,
              masterCategoryName: item.masterCategoryName,
            });
          });
        }

        // if (searchData.length == 0) {
        //   return apiResponse.successResponseWithData(res, "Searched Data Found Sucessfully.",)
        // }

        return apiResponse.successResponseWithData(res, "Searched Data Found Sucessfully.", searchData);
      }

    }
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  };
};


module.exports = { filterProducts, searchProducts, filterCategory };