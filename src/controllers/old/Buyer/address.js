const addressModel = require("../../models/addressModel");
const apiResponse = require("../../../helpers/apiResponse");

// const { s3Uploadv2 } = require('../../service/s3_service');
require('dotenv').config();


const createAddress =  async(req, res, next) => {


 
    try {
        console.log(req.body,"req.body");
		const requestData = req.body;

	  console.log(requestData)
     
                const createAddressData = new addressModel({
                    
                    "name": requestData.name,
                    "userId":requestData.userId,
                    "area": requestData.area,
                    "buildingNo": requestData.buildingNo,
                    "country": requestData.country,
                    "landmark": requestData.landmark,
                    "mobNo": requestData.mobNo,
                    "state": requestData.state,
                    "street": requestData.street,
                    "zipCode": requestData.zipCode,
                   
                }
               );
               createAddressData.save();

				// createCategoryData.save();
				
				return apiResponse.successResponseWithData(res,"create Address Successfully.", createAddressData);
				
			
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


const getAddress =  async(req, res, next) => {



    // try {
	// 	const { userId } = req.body;
		
	// 	// const authToken = req.headers.authorization;
	// 	// const decoded = jwt.decode(authToken);
		
		
	// 	const addressDetails = await addressModel.findOne({userId :userId});
		
	// 	if (addressDetails) {
			
	// 		// if(auctionDetails.status) {

	// 			addressDetails.userId = userId;
			

	// 			addressDetails.save();

	// 			return apiResponse.successResponseWithData(res,"get Address.", addressDetails);
				
	// 		// }else {
	// 		// 	return apiResponse.unauthorizedResponse(res, "address not available.");
	// 		// }	
			
	// 	}else{
	// 		return apiResponse.unauthorizedResponse(res,"User not found.", "");
	// 	}
		
		
	// } catch (err) {
	// 	console.log(err)
	// 	return apiResponse.ErrorResponse(res, err);
	// }


	try {
		const { userId } = req.body;
		
	

		const addressDetail = await addressModel.find({userId:userId}).then(function (addressDetails, err) {
            if(err) {

                return apiResponse.ErrorResponse(res, err);

            }else if(addressDetails.length > 0) {
				
				
                return apiResponse.successResponseWithData(res,"get addressDetails..", addressDetails);

            }
			else{

                return apiResponse.successResponseWithData(res, "No addressDetails Found",[]);
                
            }
        });	
		
		
	} catch (err) {
		console.log(err,"err")
		return apiResponse.ErrorResponse(res, err);
	}

}


const editAddress =  async(req, res) => {
 
    try {

		const requestData = req.body;
		
		if(requestData.addresId != null){

			const editAddressData = await addressModel.findOne({_id : requestData.addresId});

			editAddressData.name = requestData.name;
			editAddressData.userId = requestData.userId;
			editAddressData.area = requestData.area;
			editAddressData.buildingNo = requestData.buildingNo;
			editAddressData.country = requestData.country;
			editAddressData.landmark = requestData.landmark;
			editAddressData.mobNo = requestData.mobNo;
			editAddressData.state = requestData.state;
			editAddressData.street = requestData.street;
			editAddressData.zipCode = requestData.zipCode;

			await editAddressData.save();
					
			return apiResponse.successResponseWithData(res,"Address updated successfully.", {"addressData": editAddressData});

		}else{
			return apiResponse.validationErrorWithData(res,"please provide address id.", {}, 1);	
		}		
		
	} catch (err) {
		console.log(err)
		return apiResponse.ErrorResponse(res, err);
	}

}


module.exports = {  createAddress ,getAddress, editAddress}