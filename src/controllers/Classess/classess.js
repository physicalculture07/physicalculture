const ClassModel = require('../../models/ClassModel')
const apiResponse = require("../../helpers/apiResponse");
const CourseModel = require('../../models/CourseModel');
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


const createClass = async (req, res, next) => {
	try {
	  const { courseId, className } = req.body;
	  const classVideo = req.files['classVideo'] ? req.files['classVideo'][0].path : null;
	  const classNotes = req.files['classNotes'] ? req.files['classNotes'][0].path : null;
  
	  // Check if the course exists
	  const course = await CourseModel.findById(courseId);
	  if (!course) {
		return res.status(404).json({ message: 'Course not found' });
	  }
  
	  // Create new class
	  const newClass = new ClassModel({
		courseId,
		className,
		classVideo,
		classNotes,
	  });
  
	  const savedClass = await newClass.save();
	  res.status(201).json(savedClass);
	} catch (error) {
		console.log(error);
	  res.status(500).json({ message: error });
	}
  };

module.exports = { uploadClassStart,  uploadClassPart, uploadClassComplete, getClasses, getClassById, updateClassesById, deleteClassesById, createClass}