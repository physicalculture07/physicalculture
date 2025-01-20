const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { mkdir } = require("fs/promises");
// const upload = multer({ dest: 'uploads/' });

const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');


const folderpath = {
  ClassFiles:"uploads/classfiles"
};

const cloudFolder = {
  PdfNotes: "pdfnotes",
  PreviousPapers: "previouspapers",
  SyllabusPdf: "syllabuspdf",
  TestSeriesPdf: "testseriespdf",
  ClassFiles:"classes",
  ClassNotesFiles:"classes/notes",

  PdfNotesImages: "pdfnotes/images",
  PreviousPapersImages: "previouspapers/images",
  SyllabusPdfImages: "syllabuspdf/images",
  TestSeriesPdfImages: "testseriespdf/images",
  ClassFilesImages:"classes/images",
  ChapterFiles:"ChapterFiles/images",


  CourseFiles:"courseimages",
  BannerFiles:"banners"
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

// const filePdfFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type, only PDFs are allowed!'), false);
//   }
// };

const filePdfFilter = (req, file, cb) => {
  // Allowed MIME types for PDFs and images
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp'
  ];

  // Check if the file's mimetype is in the allowed list
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type, only PDFs and images are allowed!'), false); // Reject the file
  }
};

const pdfNotesUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {

        let folderName = cloudFolder.PdfNotes;

        // Set the folder name based on the field name
        if (file.fieldname === 'pdfUrl') {
          folderName = cloudFolder.PdfNotes;
        } else if (file.fieldname === 'pdfImage') {
          folderName = cloudFolder.PdfNotesImages;
        }

        cb(null, `${folderName}/${Date.now()}_${file.originalname}`); // Customize the file key
        // cb(null, `${cloudFolder.folderName}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: filePdfFilter
});

const bannerUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.BannerFiles}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  }),
  fileFilter: filePdfFilter
});

const courseUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.CourseFiles}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  })
});

const chapterUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          cb(null, `${cloudFolder.ChapterFiles}/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  })
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
        } else if (file.fieldname === 'classImage') {
          folderName = cloudFolder.ClassFilesImages;
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
      if (file.mimetype === 'video/mp4' || file.mimetype === 'video/x-matroska') {
        cb(null, true); // Accept MP4 files
      } else {
        cb(new Error('Only MP4 files are allowed for classVideo!'), false); // Reject non-MP4 files
      }
    } 
    else if (file.fieldname === 'classImage') {
      
      cb(null, true); // Accept MP4 files
     
    }
    else {
      cb(new Error('Unexpected field!'), false); // Reject any other fields
    }
  }
});


const testSeriesPdfUpload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          let folderName = cloudFolder.TestSeriesPdf;

          // Set the folder name based on the field name
          if (file.fieldname === 'pdfUrl') {
            folderName = cloudFolder.TestSeriesPdf;
          } else if (file.fieldname === 'pdfImage') {
            folderName = cloudFolder.TestSeriesPdfImages;
          }

          cb(null, `${folderName}/${Date.now()}_${file.originalname}`); 
          // cb(null, `${cloudFolder.TestSeriesPdf}/${Date.now()}_${file.originalname}`); // Customize the file key
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
          let folderName = cloudFolder.SyllabusPdf;

            // Set the folder name based on the field name
          if (file.fieldname === 'pdfUrl') {
            folderName = cloudFolder.SyllabusPdf;
          } else if (file.fieldname === 'pdfImage') {
            folderName = cloudFolder.SyllabusPdfImages;
          }

          cb(null, `${folderName}/${Date.now()}_${file.originalname}`); 
          // cb(null, `${cloudFolder.SyllabusPdf}/${Date.now()}_${file.originalname}`); // Customize the file key
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
          let folderName = cloudFolder.PreviousPapers;

            // Set the folder name based on the field name
          if (file.fieldname === 'pdfUrl') {
            folderName = cloudFolder.PreviousPapers;
          } else if (file.fieldname === 'pdfImage') {
            folderName = cloudFolder.PreviousPapersImages;
          }

          cb(null, `${folderName}/${Date.now()}_${file.originalname}`); 
          // cb(null, `${cloudFolder.PreviousPapers}/${Date.now()}_${file.originalname}`); // Customize the file key
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

const deleteFileFromS3 = async (key) => {
  try {
    const params = {
      Bucket: "physicalcultureclassess",
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    console.log(`File deleted successfully: ${key}`);
  } catch (error) {
    console.error(`Error deleting file: ${key}`, error);
    throw new Error('Error deleting file');
  }
};








module.exports = { fileUploadDirectoryCheck, pdfNotesUpload, classUpload, testSeriesPdfUpload, syllabusPdfUpload, previousPapersUpload, deleteFileFromS3, courseUpload, bannerUpload, chapterUpload };