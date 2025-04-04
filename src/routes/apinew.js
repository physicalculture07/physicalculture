const express = require("express");
const router = express.Router();
const ApiControllerP2NewApis =require('../controllers/Api/ApiControllerP2NewApis');
const { isAuth } = require('../middlewares/auth');

router.get("/test-series", ApiControllerP2NewApis.getAllTestSeries);
router.get("/test-series/:seriesId/tests", ApiControllerP2NewApis.getTestsBySeries);
router.get("/test/:testId/questions", ApiControllerP2NewApis.getTestQuestions);
router.post("/start-test/:testId", ApiControllerP2NewApis.startTest);
router.post("/buy-test-series/:seriesId", ApiControllerP2NewApis.buyTestSeries);
router.post("/submit-test/:testId", ApiControllerP2NewApis.submitTest);

module.exports = router;
