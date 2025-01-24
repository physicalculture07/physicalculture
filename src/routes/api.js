const express = require('express');
var router = express.Router();

const apiController = require('../controllers/Api/ApiController');
const apiControllerv2 = require('../controllers/Api/ApiControllerV2');
const apiControllerv3 = require('../controllers/Api/ApiControllerV3');
const { isAuth } = require('../middlewares/auth');

// router.post("/signup", apiController.signUp);
// router.post("/login", apiController.login);
// router.post("/verifyotp", apiController.verifyOtp);
// router.post("/forgotpassword", apiController.forgotPassword);
// router.post("/resetpassword", apiController.resetPassword);

router.post("/signup", apiControllerv2.signUp);
router.post("/login", apiControllerv2.login);
router.post("/verifyotp", apiControllerv2.verifyOtp);
router.post("/forgotpassword", apiControllerv2.forgotPassword);
router.post("/resetpassword", apiControllerv2.resetPassword);

router.post("/v2/signup", apiControllerv2.signUp);
router.post("/v2/login", apiControllerv3.login);
router.post("/v2/verifyotp", apiControllerv2.verifyOtp);
router.post("/v2/forgotpassword", apiControllerv2.forgotPassword);
router.post("/v2/resetpassword", apiControllerv2.resetPassword);

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

// router.get("/user_profile", apiController.userProfile);
// router.post("/update_user_profile", apiController.updateUserProfile);
// router.get("/all_courses", apiController.getAllCourses)
// router.get("/get_classesbycourse/:id", apiController.getClassByCourseId)
// router.get("/all_notes", apiController.getAllPdfNotes)
// router.get("/all_previous_papers", apiController.getAllPreviousPapers)
// router.get("/all_syllabus", apiController.getAllSyllabus)
// router.get("/all_testseries", apiController.getAllTestSeries)
// router.get("/all_banner", apiController.getAllBanners)
// router.post("/buy_course", apiController.buyCourse)
// router.post("/download_class_video", apiController.downloadClassVideo);
// router.get("/contactus", apiController.contactUs);
// router.get("/all_news",apiControllerv2.getAllNews)

router.get("/user_profile", isAuth, apiControllerv2.userProfile);
router.post("/update_user_profile",isAuth,  apiControllerv2.updateUserProfile);
router.get("/all_courses", isAuth, apiControllerv2.getAllCourses)
router.get("/get_classesbycourse/:id",isAuth,  apiControllerv2.getClassByCourseId)
router.get("/all_notes",isAuth, apiControllerv2.getAllPdfNotes)
router.get("/all_previous_papers",isAuth, apiControllerv2.getAllPreviousPapers)
router.get("/all_syllabus",isAuth, apiControllerv2.getAllSyllabus)
router.get("/all_testseries",isAuth, apiControllerv2.getAllTestSeries)
router.get("/all_banner", isAuth, apiControllerv2.getAllBanners)
router.post("/buy_course", isAuth, apiControllerv2.buyCourse)
router.post("/download_class_video",isAuth,  apiControllerv2.downloadClassVideo);
router.get("/contactus",isAuth,  apiControllerv2.contactUs);
router.get("/all_news",isAuth, apiControllerv2.getAllNews)

router.get("/v2/user_profile",  apiControllerv2.userProfile);
router.post("/v2/update_user_profile",  apiControllerv2.updateUserProfile);
router.get("/v2/all_courses",  apiControllerv2.getAllCourses)
router.get("/v2/get_classesbycourse/:id",  apiControllerv2.getClassByCourseId)
router.get("/v2/all_notes",  apiControllerv2.getAllPdfNotes)
router.get("/v2/all_previous_papers",  apiControllerv2.getAllPreviousPapers)
router.get("/v2/all_syllabus", apiControllerv2.getAllSyllabus)
router.get("/v2/all_testseries", apiControllerv2.getAllTestSeries)
router.get("/v2/all_banner", apiControllerv2.getAllBanners)
router.post("/v2/buy_course", apiControllerv2.buyCourse)
router.post("/v2/download_class_video", apiControllerv2.downloadClassVideo);
router.get("/v2/contactus", apiControllerv2.contactUs);
router.get("/v2/all_news", apiControllerv2.getAllNews)

router.post("/v2/allChapters", apiControllerv3.getAllChapters)
router.post("/v2/allChaptersByCourse", apiControllerv3.getAllChaptersByCourse)
router.post("/v/allChaptersClasses", apiControllerv3.getChapterClassByCourseId)





module.exports = router;

