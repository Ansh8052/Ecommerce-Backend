/**
 * countryController.js
 * @description : exports action methods for country.
 */

const Country = require('../../../model/country');
const countrySchemaKey = require('../../../utils/validation/countryValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../../utils/deleteDependent');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Country in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Country. {status, message, data}
 */ 
const addCountry = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      countrySchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Country(dataToCreate);
    let createdCountry = await dbService.create(Country,dataToCreate);
    return res.success({ data : createdCountry });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Country in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Countrys. {status, message, data}
 */
const bulkInsertCountry = async (req,res)=>{
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
    let createdCountrys = await dbService.create(Country,dataToCreate);
    createdCountrys = { count: createdCountrys ? createdCountrys.length : 0 };
    return res.success({ data:{ count:createdCountrys.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Country from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Country(s). {status, message, data}
 */
const findAllCountry = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      countrySchemaKey.findFilterKeys,
      Country.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Country, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundCountrys = await dbService.paginate( Country,query,options);
    if (!foundCountrys || !foundCountrys.data || !foundCountrys.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundCountrys });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Country from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Country. {status, message, data}
 */
const getCountry = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundCountry = await dbService.findOne(Country,query, options);
    if (!foundCountry){
      return res.recordNotFound();
    }
    return res.success({ data :foundCountry });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Country.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getCountryCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      countrySchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedCountry = await dbService.count(Country,where);
    return res.success({ data : { count: countedCountry } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Country with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Country.
 * @return {Object} : updated Country. {status, message, data}
 */
const updateCountry = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      countrySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCountry = await dbService.updateOne(Country,query,dataToUpdate);
    if (!updatedCountry){
      return res.recordNotFound();
    }
    return res.success({ data :updatedCountry });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Country with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Countrys.
 * @return {Object} : updated Countrys. {status, message, data}
 */
const bulkUpdateCountry = async (req,res)=>{
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
    let updatedCountry = await dbService.updateMany(Country,filter,dataToUpdate);
    if (!updatedCountry){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedCountry } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Country with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Country.
 * @return {obj} : updated Country. {status, message, data}
 */
const partialUpdateCountry = async (req,res) => {
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
      countrySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCountry = await dbService.updateOne(Country, query, dataToUpdate);
    if (!updatedCountry) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCountry });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Country from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Country.
 * @return {Object} : deactivated Country. {status, message, data}
 */
const softDeleteCountry = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedCountry = await deleteDependentService.softDeleteCountry(query, updateBody);
    if (!updatedCountry){
      return res.recordNotFound();
    }
    return res.success({ data:updatedCountry });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Country from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Country. {status, message, data}
 */
const deleteCountry = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedCountry;
    if (req.body.isWarning) { 
      deletedCountry = await deleteDependentService.countCountry(query);
    } else {
      deletedCountry = await deleteDependentService.deleteCountry(query);
    }
    if (!deletedCountry){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCountry });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Country in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyCountry = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedCountry;
    if (req.body.isWarning) {
      deletedCountry = await deleteDependentService.countCountry(query);
    }
    else {
      deletedCountry = await deleteDependentService.deleteCountry(query);
    }
    if (!deletedCountry){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCountry });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Country from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Country.
 * @return {Object} : number of deactivated documents of Country. {status, message, data}
 */
const softDeleteManyCountry = async (req,res) => {
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
    let updatedCountry = await deleteDependentService.softDeleteCountry(query, updateBody);
    if (!updatedCountry) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCountry });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addCountry,
  bulkInsertCountry,
  findAllCountry,
  getCountry,
  getCountryCount,
  updateCountry,
  bulkUpdateCountry,
  partialUpdateCountry,
  softDeleteCountry,
  deleteCountry,
  deleteManyCountry,
  softDeleteManyCountry    
};