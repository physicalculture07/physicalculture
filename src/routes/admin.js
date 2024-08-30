var express = require("express");
// const { isAuth } = require("../middlewares/auth");
const {
  classUpload,
  pdfNotesUpload,
  previousPapersUpload,
  syllabusPdfUpload,
  testSeriesPdfUpload,
  classNotesUpload,
} = require("../helpers/fileUploader");

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
router.put("/updateuserstatus", userAdminController.updateUserStatus);

// Courses route
router.get("/all_courses", courses.getCourse);
router.post("/create_course", courses.createCourse);
router.put("/create_course/:id", courses.updateCourse);
router.get("/all_courses/:id", courses.getCoursebyId);
router.delete("/remove_course/:id", courses.deleteCourse);

// Classes routes
router.get("/all_classes", classes.getClasses);
router.get("/all_classes/:id", classes.getClassById);
router.post(
  "/create_class",
  (req, res, next) => {
    classUpload.fields([
      { name: "classVideo", maxCount: 1 },
      { name: "classNotes", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  classes.createClass
);
router.put(
  "/edit_class/:id",
  (req, res, next) => {
    classUpload.fields([
      { name: "classVideo", maxCount: 1 },
      { name: "classNotes", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  classes.updateClassesById
);
router.delete("/remove_class/:id", classes.deleteClassesById);

// pdfnotes admin routes
router.get("/all_pdfnotes", pdfnotes.getAllPdfNotes);
router.get("/all_pdfnotes/:id", pdfnotes.getPdfNoteById);
router.post(
  "/create_pdfnotes",
  (req, res, next) => {
    pdfNotesUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          // If a Multer error occurred, return it to the client
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  pdfnotes.createPdfNote
);
router.put(
  "/edit_pdfnotes/:id",
  (req, res, next) => {
    pdfNotesUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          // If a Multer error occurred, return it to the client
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  pdfnotes.updatePdfNoteById
);
router.delete("/remove_pdfnotes/:id", pdfnotes.deletePdfNoteById);

// previous year papers
router.get("/all_previouspapers", previouspaper.getAllPreviousPapers);
router.get("/all_previouspapers/:id", previouspaper.getPreviousPaperById);
router.post(
  "/createPreviousPaper",
  (req, res, next) => {
    previousPapersUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          // If a Multer error occurred, return it to the client
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  previouspaper.createPreviousPaper
);
router.put(
  "/edit_previouspaper/:id",
  (req, res, next) => {
    previousPapersUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          // If a Multer error occurred, return it to the client
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  previouspaper.updatePreviousPaperById
);
router.delete("/remove_previouspaper/:id", previouspaper.deletePreviousPaperById);

// syllabus routes
router.get("/all_syllabus", syllabus.getAllSyllabus);
router.get("/all_syllabus/:id", syllabus.getSyllabusById);
router.post(
  "/createSyllabus",
  (req, res, next) => {
    syllabusPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  syllabus.createSyllabus
);
router.put(
  "/edit_syllabus",
  (req, res, next) => {
    syllabusPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  syllabus.updateSyllabusById
);
router.delete("/remove_syllabus/:id", syllabus.deleteSyllabusById);

// testSeries routes
router.get("/all_testSeries", testseries.getAllTestSeries);
router.get("/all_testSeries/:id", testseries.getTestSeriesById);
router.post(
  "/createTestSeries",
  (req, res, next) => {
    testSeriesPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          // If a Multer error occurred, return it to the client
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  testseries.createTestSeries
);
router.put(
  "/edit_testseries/:id",
  (req, res, next) => {
    testSeriesPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }])(
      req,
      res,
      (err) => {
        if (err) {
          return res.status(400).json({ message: err.message, status: false });
        }
        next();
      }
    );
  },
  testseries.updateTestSeriesById
);
router.delete("/remove_testseries/:id", testseries.deleteTestSeriesById);


module.exports = router;