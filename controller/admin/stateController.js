/**
 * stateController.js
 * @description : exports action methods for state.
 */

const State = require('../../model/state');
const stateSchemaKey = require('../../utils/validation/stateValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of State in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created State. {status, message, data}
 */ 
const addState = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      stateSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new State(dataToCreate);
    let createdState = await dbService.create(State,dataToCreate);
    return res.success({ data : createdState });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of State in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created States. {status, message, data}
 */
const bulkInsertState = async (req,res)=>{
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
    let createdStates = await dbService.create(State,dataToCreate);
    createdStates = { count: createdStates ? createdStates.length : 0 };
    return res.success({ data:{ count:createdStates.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of State from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found State(s). {status, message, data}
 */
const findAllState = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      stateSchemaKey.findFilterKeys,
      State.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(State, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundStates = await dbService.paginate( State,query,options);
    if (!foundStates || !foundStates.data || !foundStates.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundStates });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of State from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found State. {status, message, data}
 */
const getState = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundState = await dbService.findOne(State,query, options);
    if (!foundState){
      return res.recordNotFound();
    }
    return res.success({ data :foundState });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of State.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getStateCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      stateSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedState = await dbService.count(State,where);
    return res.success({ data : { count: countedState } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of State with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated State.
 * @return {Object} : updated State. {status, message, data}
 */
const updateState = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      stateSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedState = await dbService.updateOne(State,query,dataToUpdate);
    if (!updatedState){
      return res.recordNotFound();
    }
    return res.success({ data :updatedState });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of State with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated States.
 * @return {Object} : updated States. {status, message, data}
 */
const bulkUpdateState = async (req,res)=>{
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
    let updatedState = await dbService.updateMany(State,filter,dataToUpdate);
    if (!updatedState){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedState } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of State with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated State.
 * @return {obj} : updated State. {status, message, data}
 */
const partialUpdateState = async (req,res) => {
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
      stateSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedState = await dbService.updateOne(State, query, dataToUpdate);
    if (!updatedState) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedState });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of State from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of State.
 * @return {Object} : deactivated State. {status, message, data}
 */
const softDeleteState = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedState = await deleteDependentService.softDeleteState(query, updateBody);
    if (!updatedState){
      return res.recordNotFound();
    }
    return res.success({ data:updatedState });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of State from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted State. {status, message, data}
 */
const deleteState = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedState;
    if (req.body.isWarning) { 
      deletedState = await deleteDependentService.countState(query);
    } else {
      deletedState = await deleteDependentService.deleteState(query);
    }
    if (!deletedState){
      return res.recordNotFound();
    }
    return res.success({ data :deletedState });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of State in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyState = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedState;
    if (req.body.isWarning) {
      deletedState = await deleteDependentService.countState(query);
    }
    else {
      deletedState = await deleteDependentService.deleteState(query);
    }
    if (!deletedState){
      return res.recordNotFound();
    }
    return res.success({ data :deletedState });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of State from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of State.
 * @return {Object} : number of deactivated documents of State. {status, message, data}
 */
const softDeleteManyState = async (req,res) => {
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
    let updatedState = await deleteDependentService.softDeleteState(query, updateBody);
    if (!updatedState) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedState });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addState,
  bulkInsertState,
  findAllState,
  getState,
  getStateCount,
  updateState,
  bulkUpdateState,
  partialUpdateState,
  softDeleteState,
  deleteState,
  deleteManyState,
  softDeleteManyState    
};