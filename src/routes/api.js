const express = require('express');
var router = express.Router();

const apiController = require('../controllers/Api/ApiController');
const { isAuth } = require('../middlewares/auth');

router.post("/signup", apiController.signUp);
router.post("/login", apiController.login);
router.post("/verifyotp", apiController.verifyOtp);
router.post("/forgotpassword", apiController.forgotPassword);
router.post("/resetpassword", apiController.resetPassword);
router.get("/user_profile",isAuth, apiController.userProfile);
router.post("/update_user_profile",isAuth, apiController.updateUserProfile);
router.get("/all_courses",isAuth, apiController.getAllCourses)
router.get("/get_classesbycourse/:id", isAuth, apiController.getClassByCourseId)
router.get("/all_notes", isAuth, apiController.getAllPdfNotes)
router.get("/all_previous_papers", isAuth, apiController.getAllPreviousPapers)
router.get("/all_syllabus", isAuth, apiController.getAllSyllabus)
router.get("/all_testseries", isAuth, apiController.getAllTestSeries)
router.get("/all_banner", isAuth, apiController.getAllBanners)
router.post("/buy_course", isAuth, apiController.buyCourse)
router.post("/download_class_video",isAuth, apiController.downloadClassVideo);


module.exports = router;

