var express = require("express");
// const { isAuth } = require("../middlewares/auth");
const { classUpload, pdfNotesUpload, previousPapersUpload, syllabusPdfUpload, testSeriesPdfUpload, classNotesUpload } = require("../helpers/fileUploader");


const courses = require("../controllers/Course/courses");
const classes = require("../controllers/Classess/classess");
const pdfnotes = require("../controllers/PdfNotes/pdfnotes");
const previouspaper = require("../controllers/PreviousPaper/previouspaper");
const syllabus = require("../controllers/Syllabus/syllabus");
const testseries = require("../controllers/TestSeries/testseries");
const userAdminController = require("../controllers/User/AuthController");
const { validateClassUpload } = require("../middlewares/filevalidation");




var router = express.Router();

router.post("/adminLogin", userAdminController.login);
router.post("/adminsignupregister", userAdminController.signUp);
router.get("/adminallusers", userAdminController.getAllUsers);


// Courses route
router.get("/all_courses", courses.getCourse);
router.post("/create_course", courses.createCourse);


// Classes routes
router.get("/all_classes", classes.getClasses);
router.get("/all_classes/:id", classes.getClassById);

router.post('/create_class', (req, res, next) => {
    classUpload.fields([
      { name: 'classVideo', maxCount: 1 },
      { name: 'classNotes', maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message , "status": false});
      }
      // Proceed to the next middleware or route handler
      next();
    });
  }, classes.createClass);

// pdfnotes admin routes
router.get("/all_pdfnotes", pdfnotes.getAllPdfNotes);
router.get("/all_pdfnotes/:id", pdfnotes.getPdfNoteById);
router.post('/create_pdfnotes', (req, res, next) => {
    pdfNotesUpload.fields([
      { name: 'pdfUrl', maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message , "status": false});
      }
      next();
    });
  }, pdfnotes.createPdfNote);

// previous year papers
router.get("/all_previouspapers", previouspaper.getAllPreviousPapers);
router.get("/all_previouspapers/:id", previouspaper.getPreviousPaperById);
router.post('/createPreviousPaper', (req, res, next) => {
    previousPapersUpload.fields([
    { name: 'pdfUrl', maxCount: 1 }
])(req, res, (err) => {
    if (err) {
    // If a Multer error occurred, return it to the client
    return res.status(400).json({ message: err.message , "status": false});
    }
    next();
});
}, previouspaper.createPreviousPaper);


// syllabus routes
router.get("/all_syllabus", syllabus.getAllSyllabus);
router.get("/all_syllabus/:id", syllabus.getSyllabusById);

router.post('/createSyllabus', (req, res, next) => {
    syllabusPdfUpload.fields([
    { name: 'pdfUrl', maxCount: 1 }
])(req, res, (err) => {
    if (err) {
    // If a Multer error occurred, return it to the client
    return res.status(400).json({ message: err.message , "status": false});
    }
    next();
});
}, syllabus.createSyllabus);

// testSeries routes
router.get("/all_testSeries", testseries.getAllTestSeries);
router.get("/all_testSeries/:id", testseries.getTestSeriesById);

router.post('/createTestSeries', (req, res, next) => {
    testSeriesPdfUpload.fields([
    { name: 'pdfUrl', maxCount: 1 }
])(req, res, (err) => {
    if (err) {
    // If a Multer error occurred, return it to the client
    return res.status(400).json({ message: err.message , "status": false});
    }
    next();
});
}, testseries.createTestSeries);

// router.post('/create_pdfnotes', pdfNotesUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), pdfnotes.createPdfNote);
// router.post('/createPreviousPaper', previousPapersUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), previouspaper.createPreviousPaper);
// router.post('/createSyllabus', syllabusPdfUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), syllabus.createSyllabus);
// router.post('/createTestSeries', testSeriesPdfUpload.fields([{ name: 'pdfUrl', maxCount: 1 }]), testseries.createTestSeries);




 
module.exports = router;