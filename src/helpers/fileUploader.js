const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { mkdir } = require("fs/promises");
// const upload = multer({ dest: 'uploads/' });

const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');


const folderpath = {
  ClassFiles:"uploads/classfiles"
};

const cloudFolder = {
  PdfNotes: "pdfnotes",
  PreviousPapers: "previouspapers",
  SyllabusPdf: "syllabuspdf",
  TestSeriesPdf: "testseriespdf",
  ClassFiles:"classes",
  ClassNotesFiles:"classes/notes"
};

const s3Client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "BLR1",
  credentials: {
    accessKeyId: "DO009L2UXDWVYDHFTDAQ",
    secretAccessKey: "w8ZHZI0v9g7cJdfMj53yLplXgIqAfLvLDwYoEGlXGSs"
  }
});

async function fileUploadDirectoryCheck(folderName) {
  if (folderpath.hasOwnProperty(`${folderName}`)) {
    const objectName = await getObjectValue(folderName);
    const checkFolderexits = fs.existsSync(`${objectName}`);
    if (checkFolderexits) {
      return { path: true, result: true, status: checkFolderexits };
    } else {
      let fileCreate = await mkdir(`${objectName}`, { recursive: true });
      if (fileCreate) {
        return { path: true, result: true, status: fileCreate };
      } else {
        return { path: false, result: false, status: fileCreate };
      }
    }
  } else {
    return -1;
  }
}

const getObjectValue = async (modelName) => {
  let model;
  for (let [key, value] of Object.entries(folderpath)) {
    console.log(`${key}: ${value}`);
    if (key === modelName) {
      model = value;
      break;
    }
  }
  return model;
};

const filePdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only PDFs are allowed!'), false);
  }
};

const pdfNotesUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.PdfNotes}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: filePdfFilter
});

const classUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        let folderName = cloudFolder.ClassFiles;

        // Set the folder name based on the field name
        if (file.fieldname === 'classVideo') {
          folderName = cloudFolder.ClassFiles;
        } else if (file.fieldname === 'classNotes') {
          folderName = cloudFolder.ClassNotesFiles;
        }
        cb(null, `${folderName}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: function (req, file, cb) {
    // Filter files based on their fieldname and mimetype
    if (file.fieldname === 'classNotes') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true); // Accept PDF files
      } else {
        cb(new Error('Only PDF files are allowed for classNotes!'), false); // Reject non-PDF files
      }
    } else if (file.fieldname === 'classVideo') {
      if (file.mimetype === 'video/mp4') {
        cb(null, true); // Accept MP4 files
      } else {
        cb(new Error('Only MP4 files are allowed for classVideo!'), false); // Reject non-MP4 files
      }
    } else {
      cb(new Error('Unexpected field!'), false); // Reject any other fields
    }
  }
});

const classNotesUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.ClassNotesFiles}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  })
});

const testSeriesPdfUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.TestSeriesPdf}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: filePdfFilter
});

const syllabusPdfUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.SyllabusPdf}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: filePdfFilter
});

const previousPapersUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.PreviousPapers}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: filePdfFilter
});

const classStorage_local = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.ClassFiles}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const classUpload_local = multer({ storage: classStorage_local });









module.exports = { fileUploadDirectoryCheck, pdfNotesUpload, classUpload,classNotesUpload, testSeriesPdfUpload, syllabusPdfUpload, previousPapersUpload };