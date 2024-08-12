const productModel = require("../../models/productModel");
const apiResponse = require("../../../helpers/apiResponse");

const seoProduct = async (req,res)=>{
    try{
      const {productId} = req.body;
      const prodDetail = await productModel.find({_id:productId}).then(function(data,err){
       if(err){
          return apiResponse.ErrorResponse(res,err);
       }else if(data.length!=0){
           return apiResponse.successResponseWithData(res,"SEO Products is...", data);
       }else{
        return apiResponse.notFoundResponse(res, "Not found any Products.");
       }
      });
    }catch(err){
		return apiResponse.ErrorResponse(res, err);
    }
}

const seoproductAdded = async (req,res)=>{
    try{
        const {productId,meta_title,meta_keywords,meta_description} = req.body;
        const data = await productModel.findOne({_id:productId});

        data.meta_title = meta_title;
        data.meta_keywords = meta_keywords;
        data.meta_description = meta_description;

        data.save(function(err){
          if(err){
            return apiResponse.ErrorResponse(res,err);
          }else{
            return apiResponse.successResponseWithData(res,"SEO Data Added Sucessfully.",data);
          }
        });
    }catch(err){
        return apiResponse.ErrorResponse(res,err);
    }
}

module.exports = {seoProduct,seoproductAdded}