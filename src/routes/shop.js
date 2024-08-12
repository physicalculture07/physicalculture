const express = require('express');
var router = express.Router();

const shopInformation = require('../controllers/Shop/ShopController');
const { shopUpload } = require("../helpers/fileUploader");

router.post("/shop/addShop", shopUpload.array('ShopImage'), shopInformation.shopCreate);
router.get("/shop/getShop", shopInformation.getShop);
router.post("/shop/getSingleShop", shopInformation.getSingleShop);
router.post("/shop/updateShop", shopUpload.array('ShopImage'), shopInformation.updateShop);
router.delete('/shop/deleteShop',shopInformation.shopDelete);

module.exports = router;

