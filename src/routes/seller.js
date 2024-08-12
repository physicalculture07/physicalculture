var express = require("express");
const SellerAuthController = require("../controllers/Seller/SellerAuthController");
const Bid = require("../controllers/Seller/Bid");
const category = require("../controllers/admin/create-category");
const { isAuth } = require("../middlewares/auth");


var router = express.Router();
router.post("/seller-register", SellerAuthController.register);
router.post("/send-otp", SellerAuthController.sendOtp);
router.post("/verify-otp", SellerAuthController.verifyOtp);
router.post("/resend-otp", SellerAuthController.reSendOtp);
router.post("/seller-profile", isAuth, SellerAuthController.sellerProfile);
router.post("/update-seller-profile", isAuth, SellerAuthController.updateSellerProfile);
router.post("/getActiveProduct", isAuth, SellerAuthController.getActiveProduct);
router.post("/searchUsername",isAuth,SellerAuthController.userNameFind);

router.post("/create-bid", Bid.createBid);
router.post("/myBidsSeller", Bid.myBidsSeller);
router.post("/myOrders", Bid.getMyOrder);

router.get("/getCategory",category.getCategory);

router.get("/notificationList", isAuth, SellerAuthController.notificationList);
router.post("/notificationRead", isAuth, SellerAuthController.notificationRead);

module.exports = router;