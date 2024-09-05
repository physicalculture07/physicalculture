const Banner = require('../../models/BannerModel');
const apiResponse = require("../../helpers/apiResponse");

// Upload a new PDF note
const createBanner = async (req, res, next) => {
  try {
    const bannerUrl = req.files['bannerUrl'] ? req.files['bannerUrl'][0].key : null;
    
    const newBanner = new Banner({
      bannerTitle: req.body.bannerTitle,
      bannerUrl: bannerUrl // Save the file path
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all PDF notes
const getAllBanner = async (req, res) => {
  try {
    const bannerNotes = await Banner.find();
    if (bannerNotes.length > 0) {
			return apiResponse.successResponseWithData(res, "bannerNotes List.", bannerNotes);
		} else {
			return apiResponse.notFoundResponse(res, "bannerNotes not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a specific PDF note by ID
const getBannerById = async (req, res) => {
  try {
    const bannerNote = await Banner.findById(req.params.id);
    if (bannerNote) {
			return apiResponse.successResponseWithData(res, "bannerNotes List.", bannerNote);
		} else {
			return apiResponse.notFoundResponse(res, "bannerNotes not found");
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a specific PDF note by ID
const updateBannerById = async (req, res) => {
  try {
    const { bannerTitle } = req.body;
    const bannerUrl = req.files['bannerUrl'] ? req.files['bannerUrl'][0].key : null;
    const existingBanner = await Banner.findById(req.params.id);
	  if (!existingBanner) {
		  return res.status(404).json({ message: 'Class not found' });
	  }

    if (bannerTitle) existingBanner.bannerTitle = bannerTitle;
  
	  // Update classVideo and classNotes based on provided files
	  if (bannerUrl) {
		    existingBanner.bannerUrl = bannerUrl;
	  }

    const updatedBanner = await existingBanner.save();
	  res.status(200).json(updatedBanner);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};


const deleteBannerById = async (req, res, next) => {
	try {
	  
	  const existingBanner = await Banner.findById(req.params.id);
	  
	  if (!existingBanner) {
		return res.status(404).json({ message: 'Class not found' });
	  }
  
	  // Delete associated files from S3

	  if (existingBanner.bannerUrl) {
		  await deleteFileFromS3(existingBanner.bannerUrl);
	  }
  
	  // Delete the class from the database
	  await Banner.findByIdAndDelete(req.params.id);
  
	  res.status(200).json({ message: 'Class and associated files deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
};

module.exports = {
  createBanner,
  getAllBanner,
  getBannerById,
  updateBannerById,
  deleteBannerById
};
