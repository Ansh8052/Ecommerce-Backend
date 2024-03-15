/**
 * pincodeController.js
 * @description : exports action methods for pincode.
 */

const Pincode = require('../../../model/pincode');
const pincodeSchemaKey = require('../../../utils/validation/pincodeValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Pincode in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Pincode. {status, message, data}
 */ 
const addPincode = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      pincodeSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Pincode(dataToCreate);
    let createdPincode = await dbService.create(Pincode,dataToCreate);
    return res.success({ data : createdPincode });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Pincode in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Pincodes. {status, message, data}
 */
const bulkInsertPincode = async (req,res)=>{
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
    let createdPincodes = await dbService.create(Pincode,dataToCreate);
    createdPincodes = { count: createdPincodes ? createdPincodes.length : 0 };
    return res.success({ data:{ count:createdPincodes.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Pincode from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Pincode(s). {status, message, data}
 */
const findAllPincode = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      pincodeSchemaKey.findFilterKeys,
      Pincode.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Pincode, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundPincodes = await dbService.paginate( Pincode,query,options);
    if (!foundPincodes || !foundPincodes.data || !foundPincodes.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundPincodes });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Pincode from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Pincode. {status, message, data}
 */
const getPincode = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundPincode = await dbService.findOne(Pincode,query, options);
    if (!foundPincode){
      return res.recordNotFound();
    }
    return res.success({ data :foundPincode });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Pincode.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getPincodeCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      pincodeSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedPincode = await dbService.count(Pincode,where);
    return res.success({ data : { count: countedPincode } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Pincode with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Pincode.
 * @return {Object} : updated Pincode. {status, message, data}
 */
const updatePincode = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      pincodeSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPincode = await dbService.updateOne(Pincode,query,dataToUpdate);
    if (!updatedPincode){
      return res.recordNotFound();
    }
    return res.success({ data :updatedPincode });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Pincode with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Pincodes.
 * @return {Object} : updated Pincodes. {status, message, data}
 */
const bulkUpdatePincode = async (req,res)=>{
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
    let updatedPincode = await dbService.updateMany(Pincode,filter,dataToUpdate);
    if (!updatedPincode){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedPincode } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Pincode with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Pincode.
 * @return {obj} : updated Pincode. {status, message, data}
 */
const partialUpdatePincode = async (req,res) => {
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
      pincodeSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPincode = await dbService.updateOne(Pincode, query, dataToUpdate);
    if (!updatedPincode) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedPincode });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Pincode from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Pincode.
 * @return {Object} : deactivated Pincode. {status, message, data}
 */
const softDeletePincode = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedPincode = await dbService.updateOne(Pincode, query, updateBody);
    if (!updatedPincode){
      return res.recordNotFound();
    }
    return res.success({ data:updatedPincode });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Pincode from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Pincode. {status, message, data}
 */
const deletePincode = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedPincode = await dbService.deleteOne(Pincode, query);
    if (!deletedPincode){
      return res.recordNotFound();
    }
    return res.success({ data :deletedPincode });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Pincode in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyPincode = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedPincode = await dbService.deleteMany(Pincode,query);
    if (!deletedPincode){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedPincode } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Pincode from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Pincode.
 * @return {Object} : number of deactivated documents of Pincode. {status, message, data}
 */
const softDeleteManyPincode = async (req,res) => {
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
    let updatedPincode = await dbService.updateMany(Pincode,query, updateBody);
    if (!updatedPincode) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedPincode } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addPincode,
  bulkInsertPincode,
  findAllPincode,
  getPincode,
  getPincodeCount,
  updatePincode,
  bulkUpdatePincode,
  partialUpdatePincode,
  softDeletePincode,
  deletePincode,
  deleteManyPincode,
  softDeleteManyPincode    
};