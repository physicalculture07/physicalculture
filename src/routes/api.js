const express = require('express');
var router = express.Router();

const apiController = require('../controllers/Api/ApiController');

router.post("/signup", apiController.signUp);
router.post("/login", apiController.login);
router.get("/all_courses", apiController.getAllCourses)
router.get("/get_classesbycourse/:id", apiController.getClassByCourseId)
router.get("/all_notes", apiController.getAllPdfNotes)
router.get("/all_previous_papers", apiController.getAllPreviousPapers)
router.get("/all_syllabus", apiController.getAllSyllabus)
router.get("/all_testseries", apiController.getAllTestSeries)


module.exports = router;

