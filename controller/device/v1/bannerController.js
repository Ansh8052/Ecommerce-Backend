/**
 * bannerController.js
 * @description : exports action methods for banner.
 */

const Banner = require('../../../model/banner');
const bannerSchemaKey = require('../../../utils/validation/bannerValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Banner in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Banner. {status, message, data}
 */ 
const addBanner = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      bannerSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Banner(dataToCreate);
    let createdBanner = await dbService.create(Banner,dataToCreate);
    return res.success({ data : createdBanner });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Banner in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Banners. {status, message, data}
 */
const bulkInsertBanner = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdBanners = await dbService.create(Banner,dataToCreate);
    createdBanners = { count: createdBanners ? createdBanners.length : 0 };
    return res.success({ data:{ count:createdBanners.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Banner from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Banner(s). {status, message, data}
 */
const findAllBanner = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      bannerSchemaKey.findFilterKeys,
      Banner.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Banner, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundBanners = await dbService.paginate( Banner,query,options);
    if (!foundBanners || !foundBanners.data || !foundBanners.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundBanners });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Banner from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Banner. {status, message, data}
 */
const getBanner = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundBanner = await dbService.findOne(Banner,query, options);
    if (!foundBanner){
      return res.recordNotFound();
    }
    return res.success({ data :foundBanner });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Banner.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getBannerCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      bannerSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedBanner = await dbService.count(Banner,where);
    return res.success({ data : { count: countedBanner } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Banner with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Banner.
 * @return {Object} : updated Banner. {status, message, data}
 */
const updateBanner = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      bannerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedBanner = await dbService.updateOne(Banner,query,dataToUpdate);
    if (!updatedBanner){
      return res.recordNotFound();
    }
    return res.success({ data :updatedBanner });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Banner with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Banners.
 * @return {Object} : updated Banners. {status, message, data}
 */
const bulkUpdateBanner = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate['addedBy'];
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...req.body.data,
        updatedBy : req.user.id
      };
    }
    let updatedBanner = await dbService.updateMany(Banner,filter,dataToUpdate);
    if (!updatedBanner){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedBanner } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Banner with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Banner.
 * @return {obj} : updated Banner. {status, message, data}
 */
const partialUpdateBanner = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      bannerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedBanner = await dbService.updateOne(Banner, query, dataToUpdate);
    if (!updatedBanner) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedBanner });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Banner from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Banner.
 * @return {Object} : deactivated Banner. {status, message, data}
 */
const softDeleteBanner = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedBanner = await dbService.updateOne(Banner, query, updateBody);
    if (!updatedBanner){
      return res.recordNotFound();
    }
    return res.success({ data:updatedBanner });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Banner from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Banner. {status, message, data}
 */
const deleteBanner = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedBanner = await dbService.deleteOne(Banner, query);
    if (!deletedBanner){
      return res.recordNotFound();
    }
    return res.success({ data :deletedBanner });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Banner in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyBanner = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedBanner = await dbService.deleteMany(Banner,query);
    if (!deletedBanner){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedBanner } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Banner from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Banner.
 * @return {Object} : number of deactivated documents of Banner. {status, message, data}
 */
const softDeleteManyBanner = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedBanner = await dbService.updateMany(Banner,query, updateBody);
    if (!updatedBanner) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedBanner } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addBanner,
  bulkInsertBanner,
  findAllBanner,
  getBanner,
  getBannerCount,
  updateBanner,
  bulkUpdateBanner,
  partialUpdateBanner,
  softDeleteBanner,
  deleteBanner,
  deleteManyBanner,
  softDeleteManyBanner    
};