/**
 * walletTransactionController.js
 * @description : exports action methods for walletTransaction.
 */

const WalletTransaction = require('../../../model/walletTransaction');
const walletTransactionSchemaKey = require('../../../utils/validation/walletTransactionValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of WalletTransaction in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created WalletTransaction. {status, message, data}
 */ 
const addWalletTransaction = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      walletTransactionSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new WalletTransaction(dataToCreate);
    let createdWalletTransaction = await dbService.create(WalletTransaction,dataToCreate);
    return res.success({ data : createdWalletTransaction });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of WalletTransaction in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created WalletTransactions. {status, message, data}
 */
const bulkInsertWalletTransaction = async (req,res)=>{
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
    let createdWalletTransactions = await dbService.create(WalletTransaction,dataToCreate);
    createdWalletTransactions = { count: createdWalletTransactions ? createdWalletTransactions.length : 0 };
    return res.success({ data:{ count:createdWalletTransactions.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of WalletTransaction from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found WalletTransaction(s). {status, message, data}
 */
const findAllWalletTransaction = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      walletTransactionSchemaKey.findFilterKeys,
      WalletTransaction.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(WalletTransaction, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundWalletTransactions = await dbService.paginate( WalletTransaction,query,options);
    if (!foundWalletTransactions || !foundWalletTransactions.data || !foundWalletTransactions.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundWalletTransactions });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of WalletTransaction from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found WalletTransaction. {status, message, data}
 */
const getWalletTransaction = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundWalletTransaction = await dbService.findOne(WalletTransaction,query, options);
    if (!foundWalletTransaction){
      return res.recordNotFound();
    }
    return res.success({ data :foundWalletTransaction });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of WalletTransaction.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getWalletTransactionCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      walletTransactionSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedWalletTransaction = await dbService.count(WalletTransaction,where);
    return res.success({ data : { count: countedWalletTransaction } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of WalletTransaction with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated WalletTransaction.
 * @return {Object} : updated WalletTransaction. {status, message, data}
 */
const updateWalletTransaction = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      walletTransactionSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedWalletTransaction = await dbService.updateOne(WalletTransaction,query,dataToUpdate);
    if (!updatedWalletTransaction){
      return res.recordNotFound();
    }
    return res.success({ data :updatedWalletTransaction });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of WalletTransaction with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated WalletTransactions.
 * @return {Object} : updated WalletTransactions. {status, message, data}
 */
const bulkUpdateWalletTransaction = async (req,res)=>{
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
    let updatedWalletTransaction = await dbService.updateMany(WalletTransaction,filter,dataToUpdate);
    if (!updatedWalletTransaction){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedWalletTransaction } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of WalletTransaction with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated WalletTransaction.
 * @return {obj} : updated WalletTransaction. {status, message, data}
 */
const partialUpdateWalletTransaction = async (req,res) => {
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
      walletTransactionSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedWalletTransaction = await dbService.updateOne(WalletTransaction, query, dataToUpdate);
    if (!updatedWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedWalletTransaction });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of WalletTransaction from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of WalletTransaction.
 * @return {Object} : deactivated WalletTransaction. {status, message, data}
 */
const softDeleteWalletTransaction = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedWalletTransaction = await dbService.updateOne(WalletTransaction, query, updateBody);
    if (!updatedWalletTransaction){
      return res.recordNotFound();
    }
    return res.success({ data:updatedWalletTransaction });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of WalletTransaction from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted WalletTransaction. {status, message, data}
 */
const deleteWalletTransaction = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedWalletTransaction = await dbService.deleteOne(WalletTransaction, query);
    if (!deletedWalletTransaction){
      return res.recordNotFound();
    }
    return res.success({ data :deletedWalletTransaction });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of WalletTransaction in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyWalletTransaction = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedWalletTransaction = await dbService.deleteMany(WalletTransaction,query);
    if (!deletedWalletTransaction){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedWalletTransaction } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of WalletTransaction from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of WalletTransaction.
 * @return {Object} : number of deactivated documents of WalletTransaction. {status, message, data}
 */
const softDeleteManyWalletTransaction = async (req,res) => {
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
    let updatedWalletTransaction = await dbService.updateMany(WalletTransaction,query, updateBody);
    if (!updatedWalletTransaction) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedWalletTransaction } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addWalletTransaction,
  bulkInsertWalletTransaction,
  findAllWalletTransaction,
  getWalletTransaction,
  getWalletTransactionCount,
  updateWalletTransaction,
  bulkUpdateWalletTransaction,
  partialUpdateWalletTransaction,
  softDeleteWalletTransaction,
  deleteWalletTransaction,
  deleteManyWalletTransaction,
  softDeleteManyWalletTransaction    
};