/**
 * cityController.js
 * @description : exports action methods for city.
 */

const City = require('../../model/city');
const citySchemaKey = require('../../utils/validation/cityValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of City in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created City. {status, message, data}
 */ 
const addCity = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      citySchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new City(dataToCreate);
    let createdCity = await dbService.create(City,dataToCreate);
    return res.success({ data : createdCity });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of City in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Citys. {status, message, data}
 */
const bulkInsertCity = async (req,res)=>{
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
    let createdCitys = await dbService.create(City,dataToCreate);
    createdCitys = { count: createdCitys ? createdCitys.length : 0 };
    return res.success({ data:{ count:createdCitys.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of City from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found City(s). {status, message, data}
 */
const findAllCity = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      citySchemaKey.findFilterKeys,
      City.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(City, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundCitys = await dbService.paginate( City,query,options);
    if (!foundCitys || !foundCitys.data || !foundCitys.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundCitys });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of City from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found City. {status, message, data}
 */
const getCity = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundCity = await dbService.findOne(City,query, options);
    if (!foundCity){
      return res.recordNotFound();
    }
    return res.success({ data :foundCity });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of City.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getCityCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      citySchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedCity = await dbService.count(City,where);
    return res.success({ data : { count: countedCity } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of City with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated City.
 * @return {Object} : updated City. {status, message, data}
 */
const updateCity = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      citySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCity = await dbService.updateOne(City,query,dataToUpdate);
    if (!updatedCity){
      return res.recordNotFound();
    }
    return res.success({ data :updatedCity });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of City with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Citys.
 * @return {Object} : updated Citys. {status, message, data}
 */
const bulkUpdateCity = async (req,res)=>{
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
    let updatedCity = await dbService.updateMany(City,filter,dataToUpdate);
    if (!updatedCity){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedCity } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of City with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated City.
 * @return {obj} : updated City. {status, message, data}
 */
const partialUpdateCity = async (req,res) => {
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
      citySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCity = await dbService.updateOne(City, query, dataToUpdate);
    if (!updatedCity) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCity });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of City from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of City.
 * @return {Object} : deactivated City. {status, message, data}
 */
const softDeleteCity = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedCity = await deleteDependentService.softDeleteCity(query, updateBody);
    if (!updatedCity){
      return res.recordNotFound();
    }
    return res.success({ data:updatedCity });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of City from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted City. {status, message, data}
 */
const deleteCity = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedCity;
    if (req.body.isWarning) { 
      deletedCity = await deleteDependentService.countCity(query);
    } else {
      deletedCity = await deleteDependentService.deleteCity(query);
    }
    if (!deletedCity){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCity });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of City in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyCity = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedCity;
    if (req.body.isWarning) {
      deletedCity = await deleteDependentService.countCity(query);
    }
    else {
      deletedCity = await deleteDependentService.deleteCity(query);
    }
    if (!deletedCity){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCity });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of City from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of City.
 * @return {Object} : number of deactivated documents of City. {status, message, data}
 */
const softDeleteManyCity = async (req,res) => {
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
    let updatedCity = await deleteDependentService.softDeleteCity(query, updateBody);
    if (!updatedCity) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCity });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addCity,
  bulkInsertCity,
  findAllCity,
  getCity,
  getCityCount,
  updateCity,
  bulkUpdateCity,
  partialUpdateCity,
  softDeleteCity,
  deleteCity,
  deleteManyCity,
  softDeleteManyCity    
};