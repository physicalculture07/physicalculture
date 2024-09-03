const express = require('express');
var router = express.Router();

const apiController = require('../controllers/Api/ApiController');
const { isAuth } = require('../middlewares/auth');

router.post("/signup", apiController.signUp);
router.post("/login", apiController.login);
router.post("/verifyotp", apiController.verifyOtp);
router.get("/all_courses", isAuth, apiController.getAllCourses)
router.get("/get_classesbycourse/:id", isAuth, apiController.getClassByCourseId)
router.get("/all_notes", isAuth, apiController.getAllPdfNotes)
router.get("/all_previous_papers", isAuth, apiController.getAllPreviousPapers)
router.get("/all_syllabus", isAuth, apiController.getAllSyllabus)
router.get("/all_testseries", isAuth, apiController.getAllTestSeries)


module.exports = router;

