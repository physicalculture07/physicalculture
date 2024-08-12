var express = require("express");
// const { isAuth } = require("../middlewares/auth");
const { classUpload, pdfNotesUpload, previousPapersUpload, syllabusPdfUpload, testSeriesPdfUpload } = require("../helpers/fileUploader");


const courses = require("../controllers/Course/courses");
const classes = require("../controllers/Classess/classess");
const pdfnotes = require("../controllers/PdfNotes/pdfnotes");
const previouspaper = require("../controllers/PreviousPaper/previouspaper");
const syllabus = require("../controllers/Syllabus/syllabus");
const testseries = require("../controllers/TestSeries/testseries");




var router = express.Router();


// router.post("/admin/createCategory", isAuth, categoryUpload.array('categoryImage'), category.createCategory);

router.post("/create_course", courses.createCourse);
router.post('/create_class', classUpload.fields([{ name: 'classVideo', maxCount: 1 }, { name: 'classNotes', maxCount: 1 }]), classes.createClass);
router.post('/create_pdfnotes', pdfNotesUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), pdfnotes.createPdfNote);
router.post('/createPreviousPaper', previousPapersUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), previouspaper.createPreviousPaper);
router.post('/createSyllabus', syllabusPdfUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), syllabus.createSyllabus);
router.post('/createTestSeries', testSeriesPdfUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), testseries.createTestSeries);




 
module.exports = router;