const contactModel = require("../../models/contactModel")
const apiResponse = require("../../helpers//apiResponse");
require("dotenv").config();


const createContact = async (req, res, next) =>{
    try{
        const {userId,name,phone,email,company,yourQuestion} = req.body;

        const createContactData = new contactModel({
            "userId":userId,
            "name":name,
            "phone":phone,
            "email":email,
            "company":company,
            "yourQuestion":yourQuestion
        });
        createContactData.save();

        return apiResponse.successResponseWithData(res,"Create Contact Successfully.", createContactData);
    }catch(err){
        return apiResponse.ErrorResponse(res, err);
    }
}

const getAllContact = async (req,res,next)=>{
    try{
        const contactDetail = await contactModel.find().then(function(conData,err){
            if(err){
                return apiResponse.ErrorResponse(res, err);
            }else if(conData.length!=0){
                return apiResponse.successResponseWithData(res,"get Contacts..", conData);
            }else{
                return apiResponse.notFoundResponse(res, "No Contact Found");
            }
        });

    }catch(err){
        return apiResponse.ErrorResponse(res, err);
    }
}

const deleteContact = async(req,res)=>{
    try{
        const {contact_id} = req.body;

        const contactData = await contactModel.findOneAndDelete({_id:contact_id}).then(function(data,err){
          if(err){
            return apiResponse.ErrorResponse(res,err);
          }else if(data.length!=0){
            return apiResponse.successResponse(res,"Contact Deleted Sucessfully");
          }else{
            return apiResponse.notFoundResponse(res,"Contact Not Found");
          }
        });
    }catch(err){
        return apiResponse.ErrorResponse(res,err);
    }
}


module.exports = {createContact,getAllContact,deleteContact}