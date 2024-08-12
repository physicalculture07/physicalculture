const express = require('express')

const seo = require('../../src/controllers/seoAdmin/bidProduct');

var router = express.Router();

router.get("/seo/getproduct",seo.seoProduct);
router.post("/seo/addedProduct",seo.seoproductAdded);

module.exports = router;