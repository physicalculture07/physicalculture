const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { mkdir } = require("fs/promises");
// const upload = multer({ dest: 'uploads/' });

const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');


const folderpath = {
  productImage: "uploads/product_images",
  brandImage: "uploads/brand_images",
  categoryImage: "uploads/category_images",
  masterCategoryImage: "uploads/master_category_images",
  shopImage: "uploads/shop_images",
  bannerImage: "uploads/banner_images",
  homeSlideImage: "uploads/slide_images",
  blogImage: "uploads/blog_images",
  forumImage: "uploads/forum_images",
  PdfNotes: "uploads/pdfnotes",
  PreviousPapers: "uploads/previouspapers",
  SyllabusPdf: "uploads/syllabuspdf",
  TestSeriesPdf: "uploads/testseriespdf",
  ClassFiles:"uploads/classfiles"
};

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

const productStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.productImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const productUpload = multer({ storage: productStorage });

const brandStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.brandImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const brandUpload = multer({ storage: brandStorage });

const categoryStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.categoryImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const categoryUpload = multer({ storage: categoryStorage });

const masterCategoryStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.masterCategoryImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const masterCategoryUpload = multer({ storage: masterCategoryStorage });


const shopStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.shopImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const shopUpload = multer({ storage: shopStorage });

const bannerStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.bannerImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const bannerUpload = multer({ storage: bannerStorage });

const homeSlideStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.homeSlideImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const homeSlideUpload = multer({ storage: homeSlideStorage });

const blogStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.blogImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const blogUpload = multer({ storage: blogStorage });

const forumStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.blogImage}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const forumUpload = multer({ storage: forumStorage });

const pdfNotesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.PdfNotes}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const pdfNotesUpload = multer({ storage: pdfNotesStorage, fileFilter: filePdfFilter });

const previousPapersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.PreviousPapers}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const previousPapersUpload = multer({ storage: previousPapersStorage, fileFilter: filePdfFilter });

const syllabusPdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.SyllabusPdf}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const syllabusPdfUpload = multer({ storage: syllabusPdfStorage, fileFilter: filePdfFilter });

const testSeriesPdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.TestSeriesPdf}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const testSeriesPdfUpload = multer({ storage: testSeriesPdfStorage, fileFilter: filePdfFilter });

const classStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${folderpath.ClassFiles}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const classUpload = multer({ storage: classStorage });


const s3Client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "BLR1",
  credentials: {
    accessKeyId: "DO009L2UXDWVYDHFTDAQ",
    secretAccessKey: "w8ZHZI0v9g7cJdfMj53yLplXgIqAfLvLDwYoEGlXGSs"
  }
});

const upload = multer({
  storage: multerS3({
      s3: s3Client,
      bucket: 'physicalcultureclassess',
      acl: 'public-read', // Set the appropriate permissions
      key: function (req, file, cb) {
          cb(null, `classes/${Date.now()}_${file.originalname}`); // Customize the file key
      }
  })
});




module.exports = { homeSlideUpload, shopUpload, productUpload, bannerUpload, fileUploadDirectoryCheck, brandUpload, categoryUpload, masterCategoryUpload, blogUpload, forumUpload, testSeriesPdfUpload, syllabusPdfUpload, previousPapersUpload, pdfNotesUpload, classUpload , upload};