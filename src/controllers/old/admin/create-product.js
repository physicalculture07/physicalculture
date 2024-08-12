const productModel = require("../../models/productModel");
const apiResponse = require("../../helpers/apiResponse");

//s3 bucket
const { s3Uploadv2 } = require('../../service/s3_service');
require('dotenv').config()

const createProduct = async (req, res, next) => {

	const file = req.files;

	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}

	try {

		const result = await s3Uploadv2(file);

		const data = req.body;
		data.prdouctInfo = JSON.parse(data.prdouctInfo);
		data.file = result[0].Location;

		const productData = new productModel(data);

		productData.save(function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else {
				return apiResponse.successResponseWithData(res, "Product Created.", productData);
			}
		});
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}
}




const getProductDetails = async (req, res, next) => {

	try {
		const { brand } = req.body;
		const productDetail = await productModel.find({ brand: brand }).limit(1).then(async function (productDetails, err) {
			if (err) {

				return apiResponse.ErrorResponse(res, err);

			} else if (productDetails.length > 0) {

				const minimumBidPrice = await productModel.findOne({ brand: brand }, { bidPrice: 1 }).sort({ bidPrice: 1 });
				const maximumBidPrice = await productModel.findOne({ brand: brand }, { bidPrice: 1 }).sort({ bidPrice: -1 });

				let results = [];
				const minimumBidPrice1 = minimumBidPrice.bidPrice;
				const maximumBidPrice1 = maximumBidPrice.bidPrice;
				const masterCategoryName = productDetails[0].productDetails;
				const productCategory = productDetails[0].productCategory;

				let productInfoMob = [];
				productDetails.forEach((doc, index) => {

					let ar3 = Object.entries(doc.prdouctInfo)

					ar3.forEach(item => {
						// const key = Object.keys(itme)
						const value = Object.values(item)
						productInfoMob.push({
							"Key": value[0],
							"Value": value[1]
						})
					})

					// console.log(productInfoMob)
					results.push({
						_id: doc._id,
						originalPrice: doc.originalPrice,
						bidPrice: doc.bidPrice,
						sellerId: doc.sellerId,
						prodouctDetails: doc.prodouctDetails,
						productCategory: doc.productCategory,
						productName: doc.productName,
						brand: doc.brand,
						prdouctInfo: doc.prdouctInfo,
						prdouctMob: productInfoMob,
						productImages: doc.file,
					});
					// doc.file.forEach((image) => {
					// 	results[index]['productImages'].push({
					// 		image: baseurl + image.path,
					// 	});

					// });
					// if(results[index]['productImages']){
					// 	results[index]['singleImage'] = results[index]['productImages'][0].image;
					// }

				});

				return apiResponse.successResponseWithData(res, "get Products..", { results, minimumBidPrice1, maximumBidPrice1, masterCategoryName, productCategory });

			} else {

				return apiResponse.notFoundResponse(res, "No Products Found");

			}
		});


	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};



const getSingleProductDetails = async (req, res) => {


	try {
		const { productId } = req.body;

		const productSingleDetail = await productModel.find({ _id: productId });

		if (productSingleDetail.length != 0) {
			let data = [];

			let productInfoMob = [];
			productSingleDetail.forEach((doc) => {
				let ar3 = Object.entries(doc.prdouctInfo)

				ar3.forEach(item => {
					// const key = Object.keys(itme)
					const value = Object.values(item)
					productInfoMob.push({
						"Key": value[0],
						"Value": value[1]
					})
				})

				data.push({
					_id: doc._id,
					originalPrice: doc.originalPrice,
					bidPrice: doc.bidPrice,
					sellerId: doc.sellerId,
					prodouctDetails: doc.prodouctDetails,
					productCategory: doc.productCategory,
					productName: doc.productName,
					brand: doc.brand,
					prdouctInfo: doc.prdouctInfo,
					prdouctMob: productInfoMob,
					// file: doc.file,
					productImages: doc.file,
					meta_description: doc.meta_description,
					meta_keywords: doc.meta_keywords,
					meta_title: doc.meta_title
				});
			})

			return apiResponse.successResponseWithData(res, "Get Product ", data);
		} else {
			return apiResponse.notFoundResponse(res, "No Products Found");
		}
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getsingleProductuser = async (req, res) => {
	try {
		const { productId } = req.body;

		const productSingleDetail = await productModel.findOne({ _id: productId });

		if (productSingleDetail.length != 0) {
			return apiResponse.successResponseWithData(res, "Product Detail.", productSingleDetail)
		} else {
			return apiResponse.notFoundResponse(res, err);
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
}

const deleteProduct = async (req, res) => {
	try {
		const { productId, productCategory } = req.body;
		const productDetail = await productModel.findOneAndDelete({ _id: productId, productCategory }).then(function (delData, err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else if (delData.length != 0) {
				return apiResponse.successResponse(res, "Product Deleted Sucessfully")
			} else {
				return apiResponse.notFoundResponse(res, "Product Not Found.");
			}
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
}

const editProduct = async (req, res, next) => {
	// result[0].Location;
	const file = req.files;
	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}
	try {
		let locationArr = [];
		const result = await s3Uploadv2(file);

		result.forEach(item => {
			locationArr.push(item.Location);
		})
		// console.log(locationArr, "locationArr");
		// return

		const { productId, originalPrice, bidPrice, prodouctDetails, productCategory, productName, brand } = req.body;
		const editProduct = await productModel.findOne({ _id: productId });

		editProduct.originalPrice = originalPrice;
		editProduct.bidPrice = bidPrice;
		editProduct.prodouctDetails = prodouctDetails;
		editProduct.productCategory = productCategory;
		editProduct.productName = productName;
		editProduct.brand = brand;

		//condition for file upload
		if (req.files.length != 0) {
			editProduct.file = locationArr;
		} else {
			editProduct.file = editProduct.file;
		}


		editProduct.save(function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			} else {
				return apiResponse.successResponseWithData(res, "Product Updated Sucessfully.", editProduct);
			}
		});
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};

const getallProduct = async (req, res, next) => {
	try {
		const productDetail = await productModel.find().then(function (allProduct, err) {
			if (err) {

				return apiResponse.ErrorResponse(res, err);

			} else if (allProduct.length > 0) {

				return apiResponse.successResponseWithData(res, "get Products..", allProduct);

			} else {

				return apiResponse.notFoundResponse(res, "No Products Found");

			}
		});


	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	};
};




module.exports = { createProduct, getProductDetails, getSingleProductDetails, deleteProduct, editProduct, getallProduct, getsingleProductuser }