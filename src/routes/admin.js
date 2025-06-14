var express = require("express");
// const { isAuth } = require("../middlewares/auth");
const {
  classUpload,
  pdfNotesUpload,
  previousPapersUpload,
  syllabusPdfUpload,
  testSeriesPdfUpload,
  classNotesUpload,
  courseUpload,
  bannerUpload,
  chapterUpload,
  testSeriesNewUpload,
  testNewUpload
} = require("../helpers/fileUploader");

const courses = require("../controllers/Course/courses");
const chapter = require("../controllers/Chapter/chapter");
const classes = require("../controllers/Classess/classess");
const pdfnotes = require("../controllers/PdfNotes/pdfnotes");
const banners = require("../controllers/Banner/banner");
const previouspaper = require("../controllers/PreviousPaper/previouspaper");
const syllabus = require("../controllers/Syllabus/syllabus");
const testseries = require("../controllers/TestSeries/testseries");
const userAdminController = require("../controllers/User/AuthController");
const purchasecourse = require("../controllers/Purchase/purchase");
const purchasetestseries = require("../controllers/PurchaseTestSeries/purchasetestseries");

const testseriesnew = require("../controllers/TestSeriesNew/testseriesnew");
const test = require("../controllers/TestSeriesNew/test");

const { validateClassUpload } = require("../middlewares/filevalidation");

var router = express.Router();

router.post("/adminLogin", userAdminController.login);
router.post("/adminsignupregister", userAdminController.signUp);
router.get("/adminallusers", userAdminController.getAllUsers);
router.put("/updateuserstatus", userAdminController.updateUserStatus);

// Courses route
router.get("/all_courses", courses.getCourse);
// router.post("/create_course", courses.createCourse);
router.post(
  "/create_course",
  (req, res, next) => {
    courseUpload.fields([
      { name: "courseImage", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  courses.createCourse
);
// router.put("/create_course/:id", courses.updateCourse);
router.put(
  "/create_course/:id",
  (req, res, next) => {
    courseUpload.fields([
      { name: "courseImage", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  courses.updateCourse
);
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
      { name: "classImage", maxCount: 1 },
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
      { name: "classImage", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        console.log(err);
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
    pdfNotesUpload.fields([{ name: "pdfUrl", maxCount: 1 },{ name: "pdfImage", maxCount: 1 }])(
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
    pdfNotesUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
    previousPapersUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
    previousPapersUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
    syllabusPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
  "/edit_syllabus/:id",
  (req, res, next) => {
    syllabusPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
    testSeriesPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
    testSeriesPdfUpload.fields([{ name: "pdfUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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


// pdfnotes admin routes
router.get("/all_banners", banners.getAllBanner);
router.get("/all_banners/:id", banners.getBannerById);
router.post(
  "/create_banners",
  (req, res, next) => {
    bannerUpload.fields([{ name: "bannerUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
  banners.createBanner
);
router.put(
  "/edit_banners/:id",
  (req, res, next) => {
    bannerUpload.fields([{ name: "bannerUrl", maxCount: 1 }, { name: "pdfImage", maxCount: 1 }])(
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
  banners.updateBannerById
);
router.delete("/remove_banners/:id", banners.deleteBannerById);


router.get("/buy_course", purchasecourse.getPurchasedCourses)
router.get("/getPurchasedCoursesById/:id", purchasecourse.getPurchasedCoursesById)
router.put("/edit_purchase/:id", purchasecourse.updatePurchaseForUser)
router.post("/add_course_to_user", purchasecourse.addCourseToUser)
router.delete("/delete_purchase/:id", purchasecourse.delete_purchase);

// chapters route
router.get("/all_chapter", chapter.getChapter);
// router.post("/create_course", courses.createCourse);
router.post(
  "/create_chapter",
  (req, res, next) => {
    chapterUpload.fields([
      { name: "chapterImage", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  chapter.createChapter
);
// router.put("/create_chapter/:id", chapter.updateCourse);
router.put(
  "/update-chapter/:id",
  (req, res, next) => {
    chapterUpload.fields([
      { name: "chapterImage", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  chapter.updateChapter
);
router.get("/all_chapter/:id", chapter.getChapterbyId);
router.get("/get_chapters_by_course/:id", chapter.getChaptersbyCourseId);
router.delete("/remove_chapter/:id", chapter.deleteChapter);



// New test series route
router.get("/all_newtestseries", testseriesnew.getNewTestSeries);
// router.post("/create_course", testseriesnew.createCourse);
router.post(
  "/create_newtestseries",
  (req, res, next) => {
    testSeriesNewUpload.fields([
      { name: "image", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  testseriesnew.createNewTestSeries
);
// router.put("/create_course/:id", testseriesnew.updateCourse);
router.put(
  "/create_newtestseries/:id",
  (req, res, next) => {
    testSeriesNewUpload.fields([
      { name: "image", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  testseriesnew.updateNewTestSeries
);
router.get("/all_testseriesnew/:id", testseriesnew.getNewTestSeriesbyId);
router.delete("/remove_newtestseries/:id", testseriesnew.deleteNewTestSeries);


// Tests model
router.get("/alltests", test.getAllTests);
router.post(
  "/create_newtest",
  (req, res, next) => {
    testNewUpload.fields([
      { name: "image", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        // If a Multer error occurred, return it to the client
        return res.status(400).json({ message: err.message, status: false });
      }
      // Proceed to the next middleware or route handler
      next();
    });
  },
  test.createTest
);

router.delete("/remove_test/:id", test.deleteTest);

router.get("/buy_testseries", purchasetestseries.getPurchasedTestSeries)
router.get("/getPurchasedTestseriesById/:id", purchasetestseries.getPurchasedTestSeriesById)
router.put("/edit_purchase_testseries/:id", purchasetestseries.updatePurchaseForUser)
router.post("/add_testseries_to_user", purchasetestseries.addTestSeriesToUser)
router.delete("/delete_purchase_testseries/:id", purchasetestseries.delete_purchase);


module.exports = router;