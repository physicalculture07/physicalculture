const ClassModel = require('../../models/ClassModel')
const apiResponse = require("../../helpers/apiResponse");
const CourseModel = require('../../models/CourseModel');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { readFileSync } = require('fs');
const fs = require('fs');

// const { fromIni } = require('@aws-sdk/credential-providers');

require('dotenv').config();

// Start multipart upload
// /upload/start post
const uploadClassStart =  async (req, res) => {
	try {
	  const params = {
		Bucket: 'YOUR_S3_BUCKET_NAME',
		Key: `${Date.now().toString()}-${req.body.filename}`,
		ContentType: req.body.contentType
	  };
  
	  const multipartUpload = await s3.createMultipartUpload(params).promise();
	  res.status(200).json({ uploadId: multipartUpload.UploadId, key: params.Key });
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};
  
  // Upload part post
const uploadClassPart = async (req, res) => {
	try {
	  const { uploadId, partNumber, key } = req.body;
	  const buffer = Buffer.from(req.body.chunk, 'base64');
  
	  const params = {
		Bucket: 'YOUR_S3_BUCKET_NAME',
		Key: key,
		PartNumber: partNumber,
		UploadId: uploadId,
		Body: buffer
	  };
  
	  const uploadPart = await s3.uploadPart(params).promise();
	  res.status(200).json({ ETag: uploadPart.ETag });
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};
  
  // Complete multipart upload post
const uploadClassComplete = async (req, res) => {
	try {
	  const { uploadId, key, parts } = req.body;
  
	  const params = {
		Bucket: 'YOUR_S3_BUCKET_NAME',
		Key: key,
		UploadId: uploadId,
		MultipartUpload: {
		  Parts: parts.map((part, index) => ({
			ETag: part.ETag,
			PartNumber: index + 1
		  }))
		}
	  };
  
	  const completeUpload = await s3.completeMultipartUpload(params).promise();
  
	  // Save metadata to MongoDB
	  const newClass = new Class({
		courseId: req.body.courseId,
		className: req.body.className,
		classVideo: completeUpload.Location,
		classNotes: req.body.classNotes
	  });
  
	  const savedClass = await newClass.save();
	  res.status(201).json(savedClass);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};
//   get
const getClasses =  async (req, res) => {
	try {
	  const classes = await ClassModel.find();
	  res.status(200).json(classes);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};
//   /classes/:id  get by id
const getClassById = async (req, res) => {
	try {
	  const classData = await Class.findById(req.params.id);
	  if (!classData) return res.status(404).json({ error: 'Class not found' });
	  res.status(200).json(classData);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};
//   /classes/:id  put
const updateClassesById = async (req, res) => {
	try {
	  const updatedData = {
		courseId: req.body.courseId,
		className: req.body.className,
		classNotes: req.body.classNotes,
		classVideo: req.body.classVideo
	  };
  
	  const updatedClass = await Class.findByIdAndUpdate(req.params.id, updatedData, { new: true });
	  if (!updatedClass) return res.status(404).json({ error: 'Class not found' });
	  res.status(200).json(updatedClass);
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};
//   /classes/:id  delete
const deleteClassesById = async (req, res) => {
	try {
	  const deletedClass = await Class.findByIdAndDelete(req.params.id);
	  if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
	  res.status(200).json({ message: 'Class deleted successfully' });
	} catch (err) {
	  res.status(400).json({ error: err.message });
	}
};

// const spacesEndpoint = new AWS.Endpoint('https://physicalcultureclassess.blr1.digitaloceanspaces.com'); // Replace 'nyc3' with your region
// const s3Client = new AWS.S3({
//     endpoint: spacesEndpoint,
//     accessKeyId: 'DO009L2UXDWVYDHFTDAQ',  // Replace with your access key
//     secretAccessKey: 'w8ZHZI0v9g7cJdfMj53yLplXgIqAfLvLDwYoEGlXGSs',  // Replace with your secret key
// });

const s3Client = new S3Client({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://blr1.digitaloceanspaces.com",
    region: "BLR1",
    credentials: {
      accessKeyId: "DO009L2UXDWVYDHFTDAQ",
      secretAccessKey: "w8ZHZI0v9g7cJdfMj53yLplXgIqAfLvLDwYoEGlXGSs"
    }
});

const createClass = async (req, res, next) => {
	// console.log("asduashfjkhsdkjf");
	try {
	  const { courseId, className } = req.body;
	  const classVideo = req.files['classVideo'] ? req.files['classVideo'][0].location : null;
	  const classNotes = req.files['classNotes'] ? req.files['classNotes'][0].path : null;
	  const course = await CourseModel.findById(courseId);
	  if (!course) {
		return res.status(404).json({ message: 'Course not found' });
	  }

	//   console.log("sdad------", req.files );
	if(classVideo){
		/*const fileContent = fs.createReadStream(classVideo);
		// Set the parameters for the upload
		const uploadParams = {
			Bucket: "physicalcultureclassess",
			Key: 'classes/ayz.mp4',  // The name you want to give to the file in the bucket
			Body: fileContent,
			ACL: 'public-read',  // Set permissions (optional)
			ContentType: 'video/mp4'  // Set the appropriate content type (adjust as needed)
		};

		// Use the Upload class from AWS SDK v3 to handle the upload
		const parallelUpload = new Upload({
			client: s3Client,
			params: uploadParams
		});

		// Monitor the progress of the upload
		parallelUpload.on('httpUploadProgress', (progress) => {
			console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
		});

		// Upload the video
		const data = await parallelUpload.done();
		console.log(`Video uploaded successfully at ${data.Location}`);*/
		// Create new class
		const newClass = new ClassModel({
			courseId,
			className,
			classVideo,
			classNotes,
		  });
	  
		  const savedClass = await newClass.save();
		  res.status(201).json(savedClass);
	}else{
		// Create new class
		const newClass = new ClassModel({
			courseId,
			className,
			classVideo,
			classNotes,
		  });
	  
		  const savedClass = await newClass.save();
		  res.status(201).json(savedClass);
	}
	} catch (error) {
		console.log(error);
	  res.status(500).json({ message: error });
	}
};




module.exports = { uploadClassStart,  uploadClassPart, uploadClassComplete, getClasses, getClassById, updateClassesById, deleteClassesById, createClass}