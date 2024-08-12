const ShopModel = require('../../models/ShopModel');
const apiResponse = require("../../../helpers/apiResponse");


const shopCreate = async (req, res) => {
    const file = req.files;
    // if (!file) {
    //     return res.status(400).send({ message: "Please upload a file" });
    // }

    try {
        const data = req.body;
        data.ShopImage = file;

        const shopData = new ShopModel(data);
        shopData.save(function (err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else {
                return apiResponse.successResponseWithData(res, "Shop Created Sucessfully.", shopData);
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getShop = async (req, res) => {
    try {
        await ShopModel.find({}).then(function (data, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (data) {
                console.log(data,"image data");

                let arr = [];
                data.forEach(element => {
                    arr.push({
                        _id:element._id,
                        ShopKeeperName:element.ShopKeeperName,
                        ShopName:element.ShopName,
                        ShopNumber:element.ShopNumber,
                        PhoneNumber:element.PhoneNumber,
                        Email:element.Email,
                        ShopImage:element.ShopImage[0],
                    })
                });
                console.log(arr)
                return apiResponse.successResponseWithData(res, "Shop Data Get Sucessfully.", arr);
            } else {
                return apiResponse.notFoundResponse(res, "Shop Data Not Found.");
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const getSingleShop = async (req, res) => {
    try {
        const { shopId } = req.body;
        await ShopModel.findById({ _id: shopId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                return apiResponse.successResponseWithData(res, "Shop Data Get Sucessfully.", item);
            } else {
                return apiResponse.notFoundResponse(res, "Shop Data Not Found.");
            };
        });

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    };
};

const updateShop = async (req, res) => {
    const file = req.files;
    // if (!file) {
    //     return res.status(400).send({ message: "Please upload a file" });
    // }

    try {
        const { shopId, ShopKeeperName, PhoneNumber, ShopName, ShopNumber, Email } = req.body;
        // console.log(req.body)
        await ShopModel.findById({ _id: shopId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                item.Email = Email;
                item.ShopKeeperName = ShopKeeperName;
                item.PhoneNumber = PhoneNumber;
                item.ShopName = ShopName;
                item.ShopNumber = ShopNumber;

                if(file.length!=0){
                    item.ShopImage = file;
                }else{
                    item.ShopImage = item.ShopImage;
                }

                item.save(function (err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    } else {
                        return apiResponse.successResponseWithData(res, "Shop Updated Sucessfully.", item);
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        return apiResponse.ErrorResponse(res, err);
    };
};

const shopDelete = async (req, res) => {
    try {
        const { shopId } = req.body;
        await ShopModel.findOneAndRemove({ _id: shopId }).then(function (item, err) {
            if (err) {
                return apiResponse.ErrorResponse(res, err);
            } else if (item) {
                return apiResponse.successResponse(res, "Shop Data Delete SUcessfully.");
            } else {
                return apiResponse.notFoundResponse(res, "Shop Data Not Found.");
            }
        })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}

module.exports = { shopCreate, shopDelete, getShop, getSingleShop, updateShop };
