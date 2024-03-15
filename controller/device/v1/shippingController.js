/**
 * shippingController.js
 * @description : exports action methods for shipping.
 */

const Shipping = require('../../../model/shipping');
const shippingSchemaKey = require('../../../utils/validation/shippingValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Shipping in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Shipping. {status, message, data}
 */ 
const addShipping = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      shippingSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Shipping(dataToCreate);
    let createdShipping = await dbService.create(Shipping,dataToCreate);
    return res.success({ data : createdShipping });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Shipping in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Shippings. {status, message, data}
 */
const bulkInsertShipping = async (req,res)=>{
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
    let createdShippings = await dbService.create(Shipping,dataToCreate);
    createdShippings = { count: createdShippings ? createdShippings.length : 0 };
    return res.success({ data:{ count:createdShippings.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Shipping from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Shipping(s). {status, message, data}
 */
const findAllShipping = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      shippingSchemaKey.findFilterKeys,
      Shipping.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Shipping, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundShippings = await dbService.paginate( Shipping,query,options);
    if (!foundShippings || !foundShippings.data || !foundShippings.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundShippings });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Shipping from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Shipping. {status, message, data}
 */
const getShipping = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundShipping = await dbService.findOne(Shipping,query, options);
    if (!foundShipping){
      return res.recordNotFound();
    }
    return res.success({ data :foundShipping });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Shipping.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getShippingCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      shippingSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedShipping = await dbService.count(Shipping,where);
    return res.success({ data : { count: countedShipping } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Shipping with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Shipping.
 * @return {Object} : updated Shipping. {status, message, data}
 */
const updateShipping = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      shippingSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedShipping = await dbService.updateOne(Shipping,query,dataToUpdate);
    if (!updatedShipping){
      return res.recordNotFound();
    }
    return res.success({ data :updatedShipping });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Shipping with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Shippings.
 * @return {Object} : updated Shippings. {status, message, data}
 */
const bulkUpdateShipping = async (req,res)=>{
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
    let updatedShipping = await dbService.updateMany(Shipping,filter,dataToUpdate);
    if (!updatedShipping){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedShipping } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Shipping with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Shipping.
 * @return {obj} : updated Shipping. {status, message, data}
 */
const partialUpdateShipping = async (req,res) => {
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
      shippingSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedShipping = await dbService.updateOne(Shipping, query, dataToUpdate);
    if (!updatedShipping) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedShipping });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Shipping from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Shipping.
 * @return {Object} : deactivated Shipping. {status, message, data}
 */
const softDeleteShipping = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedShipping = await dbService.updateOne(Shipping, query, updateBody);
    if (!updatedShipping){
      return res.recordNotFound();
    }
    return res.success({ data:updatedShipping });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Shipping from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Shipping. {status, message, data}
 */
const deleteShipping = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedShipping = await dbService.deleteOne(Shipping, query);
    if (!deletedShipping){
      return res.recordNotFound();
    }
    return res.success({ data :deletedShipping });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Shipping in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyShipping = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedShipping = await dbService.deleteMany(Shipping,query);
    if (!deletedShipping){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedShipping } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Shipping from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Shipping.
 * @return {Object} : number of deactivated documents of Shipping. {status, message, data}
 */
const softDeleteManyShipping = async (req,res) => {
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
    let updatedShipping = await dbService.updateMany(Shipping,query, updateBody);
    if (!updatedShipping) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedShipping } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addShipping,
  bulkInsertShipping,
  findAllShipping,
  getShipping,
  getShippingCount,
  updateShipping,
  bulkUpdateShipping,
  partialUpdateShipping,
  softDeleteShipping,
  deleteShipping,
  deleteManyShipping,
  softDeleteManyShipping    
};