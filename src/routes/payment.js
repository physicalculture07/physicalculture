var express = require("express");
const payment = require("../controllers/Buyer/payment");
const { isAuth } = require("../middlewares/auth");
var router = express.Router();






router.post("/payment", isAuth, payment.createPayment);

module.exports = router;