const express = require('express');
var router = express.Router();

const apiController = require('../controllers/Api/ApiController');
const { isAuth } = require('../middlewares/auth');

router.post("/signup", apiController.signUp);
router.post("/login", apiController.login);
router.post("/verifyotp", apiController.verifyOtp);
router.post("/forgotpassword", apiController.forgotPassword);
router.post("/resetpassword", apiController.resetPassword);

router.post("/v2/signup", apiController.signUp);
router.post("/v2/login", apiController.login);
router.post("/v2/verifyotp", apiController.verifyOtp);
router.post("/v2/forgotpassword", apiController.forgotPassword);
router.post("/v2/resetpassword", apiController.resetPassword);

// router.get("/user_profile",isAuth, apiController.userProfile);
// router.post("/update_user_profile",isAuth, apiController.updateUserProfile);
// router.get("/all_courses",isAuth, apiController.getAllCourses)
// router.get("/get_classesbycourse/:id", isAuth, apiController.getClassByCourseId)
// router.get("/all_notes", isAuth, apiController.getAllPdfNotes)
// router.get("/all_previous_papers", isAuth, apiController.getAllPreviousPapers)
// router.get("/all_syllabus", isAuth, apiController.getAllSyllabus)
// router.get("/all_testseries", isAuth, apiController.getAllTestSeries)
// router.get("/all_banner", isAuth, apiController.getAllBanners)
// router.post("/buy_course", isAuth, apiController.buyCourse)
// router.post("/download_class_video",isAuth, apiController.downloadClassVideo);

router.get("/user_profile", apiController.userProfile);
router.post("/update_user_profile", apiController.updateUserProfile);
router.get("/all_courses", apiController.getAllCourses)
router.get("/get_classesbycourse/:id", apiController.getClassByCourseId)
router.get("/all_notes", apiController.getAllPdfNotes)
router.get("/all_previous_papers", apiController.getAllPreviousPapers)
router.get("/all_syllabus", apiController.getAllSyllabus)
router.get("/all_testseries", apiController.getAllTestSeries)
router.get("/all_banner", apiController.getAllBanners)
router.post("/buy_course", apiController.buyCourse)
router.post("/download_class_video", apiController.downloadClassVideo);
router.get("/contactus", apiController.contactUs);

router.get("/v2/user_profile", isAuth, apiController.userProfile);
router.post("/v2/update_user_profile", isAuth, apiController.updateUserProfile);
router.get("/v2/all_courses", isAuth, apiController.getAllCourses)
router.get("/v2/get_classesbycourse/:id",isAuth,  apiController.getClassByCourseId)
router.get("/v2/all_notes",isAuth,  apiController.getAllPdfNotes)
router.get("/v2/all_previous_papers",isAuth,  apiController.getAllPreviousPapers)
router.get("/v2/all_syllabus",isAuth, apiController.getAllSyllabus)
router.get("/v2/all_testseries", isAuth,apiController.getAllTestSeries)
router.get("/v2/all_banner", apiController.getAllBanners)
router.post("/v2/buy_course",isAuth, apiController.buyCourse)
router.post("/v2/download_class_video", apiController.downloadClassVideo);
router.get("/v2/contactus", apiController.contactUs);



module.exports = router;

