const ClassModel = require('../../models/ClassModel')
const apiResponse = require("../../helpers/apiResponse");
const CourseModel = require('../../models/CourseModel');
const { deleteFileFromS3 } = require('../../helpers/fileUploader');

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
		if (classes.length > 0) {
			return apiResponse.successResponseWithData(res, "Classes List.", classes);
		} else {
			return apiResponse.notFoundResponse(res, "Course not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};
//   /classes/:id  get by id
const getClassById = async (req, res) => {
	try {
		const classData = await ClassModel.findById(req.params.id);
		if (classData) {
			return apiResponse.successResponseWithData(res, "Classes List.", classData);
		} else {
			return apiResponse.notFoundResponse(res, "Course not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

const createClass = async (req, res, next) => {
	
	try {
	  const { courseId, className,classDescription,classType } = req.body;
	  const classVideo = req.files['classVideo'] ? req.files['classVideo'][0].location : null;
	  const classImage = req.files['classImage'] ? req.files['classImage'][0].location : null;
	  const classNotes = req.files['classNotes'] ? req.files['classNotes'][0].location : null;
	  const course = await CourseModel.findById(courseId);
	  if (!course) {
		return res.status(404).json({ message: 'Course not found' });
	  }

	if(classVideo && classNotes){
		// Create new class
		const newClass = new ClassModel({
			courseId,
			className,
			classDescription,
			classType,
			classVideo:req.files['classVideo'][0].key,
			classImage:req.files['classImage'][0].key,
			classNotes:req.files['classNotes'][0].key,
		  });
	  
		  const savedClass = await newClass.save();
		  res.status(201).json(savedClass);
	}else if(classVideo && classNotes == "null"){
		// Create new class
		const newClass = new ClassModel({
			courseId,
			className,
			classDescription,
			classVideo:req.files['classVideo'][0].key,
			classNotes:null,
		  });
	  
		  const savedClass = await newClass.save();
		  res.status(201).json(savedClass);
	}else if(classVideo == "null" && classNotes){
		// Create new class
		const newClass = new ClassModel({
			courseId,
			className,
			classDescription,
			classVideo:null,
			classNotes:req.files['classVideo'][0].key,
		  });
	  
		  const savedClass = await newClass.save();
		  res.status(201).json(savedClass);
	}else{
		// Create new class
		const newClass = new ClassModel({
			courseId,
			className,
			classDescription,
			classVideo,
			classNotes,
		  });
	  
		  const savedClass = await newClass.save();
		  res.status(201).json(savedClass);
	}
	} catch (error) {
		// console.log(error);
	  res.status(500).json({ message: error.message });
	}
};



//   /classes/:id  put
const updateClassesById = async (req, res, next) => {
	try {
	  const { courseId, className, classDescription, classType } = req.body;
	  const classVideo = req.files['classVideo'] ? req.files['classVideo'][0].key : null;
	  const classImage = req.files['classImage'] ? req.files['classImage'][0].key : null;
	  const classNotes = req.files['classNotes'] ? req.files['classNotes'][0].key : null;
  
	  const existingClass = await ClassModel.findById(req.params.id);
	  if (!existingClass) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Update courseId and className if provided
	  if (courseId) existingClass.courseId = courseId;
	  if (className) existingClass.className = className;
	  if (classDescription) existingClass.classDescription = classDescription;
	  if (classType) existingClass.classType = classType;
  
	  // Update classVideo and classNotes based on provided files
	  if (classImage) {
		existingClass.classImage = classImage;
	  }
	  if (classVideo) {
		existingClass.classVideo = classVideo;
	  }
	  if (classNotes) {
		existingClass.classNotes = classNotes;
	  }
  
	  const updatedClass = await existingClass.save();
	  res.status(200).json(updatedClass);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};
//   /classes/:id  delete

const deleteClassesById = async (req, res, next) => {
	try {
	  
	  const existingClass = await ClassModel.findById(req.params.id);
	  
	  if (!existingClass) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Delete associated files from S3
	  if (existingClass.classVideo) {
		await deleteFileFromS3(existingClass.classVideo);
	  }
	  if (existingClass.classNotes) {
		await deleteFileFromS3(existingClass.classNotes);
	  }
  
	  // Delete the class from the database
	  await ClassModel.findByIdAndDelete(req.params.id);
  
	  res.status(200).json({ message: 'Class and associated files deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  };







module.exports = { uploadClassStart,  uploadClassPart, uploadClassComplete, getClasses, getClassById, updateClassesById, deleteClassesById, createClass}