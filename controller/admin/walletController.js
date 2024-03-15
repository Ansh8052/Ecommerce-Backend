/**
 * walletController.js
 * @description : exports action methods for wallet.
 */

const Wallet = require('../../model/wallet');
const walletSchemaKey = require('../../utils/validation/walletValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Wallet in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Wallet. {status, message, data}
 */ 
const addWallet = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      walletSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Wallet(dataToCreate);
    let createdWallet = await dbService.create(Wallet,dataToCreate);
    return res.success({ data : createdWallet });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Wallet in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Wallets. {status, message, data}
 */
const bulkInsertWallet = async (req,res)=>{
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
    let createdWallets = await dbService.create(Wallet,dataToCreate);
    createdWallets = { count: createdWallets ? createdWallets.length : 0 };
    return res.success({ data:{ count:createdWallets.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Wallet from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Wallet(s). {status, message, data}
 */
const findAllWallet = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      walletSchemaKey.findFilterKeys,
      Wallet.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Wallet, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundWallets = await dbService.paginate( Wallet,query,options);
    if (!foundWallets || !foundWallets.data || !foundWallets.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundWallets });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Wallet from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Wallet. {status, message, data}
 */
const getWallet = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundWallet = await dbService.findOne(Wallet,query, options);
    if (!foundWallet){
      return res.recordNotFound();
    }
    return res.success({ data :foundWallet });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Wallet.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getWalletCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      walletSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedWallet = await dbService.count(Wallet,where);
    return res.success({ data : { count: countedWallet } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Wallet with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Wallet.
 * @return {Object} : updated Wallet. {status, message, data}
 */
const updateWallet = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      walletSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedWallet = await dbService.updateOne(Wallet,query,dataToUpdate);
    if (!updatedWallet){
      return res.recordNotFound();
    }
    return res.success({ data :updatedWallet });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Wallet with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Wallets.
 * @return {Object} : updated Wallets. {status, message, data}
 */
const bulkUpdateWallet = async (req,res)=>{
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
    let updatedWallet = await dbService.updateMany(Wallet,filter,dataToUpdate);
    if (!updatedWallet){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedWallet } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Wallet with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Wallet.
 * @return {obj} : updated Wallet. {status, message, data}
 */
const partialUpdateWallet = async (req,res) => {
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
      walletSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedWallet = await dbService.updateOne(Wallet, query, dataToUpdate);
    if (!updatedWallet) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedWallet });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Wallet from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Wallet.
 * @return {Object} : deactivated Wallet. {status, message, data}
 */
const softDeleteWallet = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedWallet = await deleteDependentService.softDeleteWallet(query, updateBody);
    if (!updatedWallet){
      return res.recordNotFound();
    }
    return res.success({ data:updatedWallet });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Wallet from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Wallet. {status, message, data}
 */
const deleteWallet = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedWallet;
    if (req.body.isWarning) { 
      deletedWallet = await deleteDependentService.countWallet(query);
    } else {
      deletedWallet = await deleteDependentService.deleteWallet(query);
    }
    if (!deletedWallet){
      return res.recordNotFound();
    }
    return res.success({ data :deletedWallet });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Wallet in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyWallet = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedWallet;
    if (req.body.isWarning) {
      deletedWallet = await deleteDependentService.countWallet(query);
    }
    else {
      deletedWallet = await deleteDependentService.deleteWallet(query);
    }
    if (!deletedWallet){
      return res.recordNotFound();
    }
    return res.success({ data :deletedWallet });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Wallet from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Wallet.
 * @return {Object} : number of deactivated documents of Wallet. {status, message, data}
 */
const softDeleteManyWallet = async (req,res) => {
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
    let updatedWallet = await deleteDependentService.softDeleteWallet(query, updateBody);
    if (!updatedWallet) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedWallet });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addWallet,
  bulkInsertWallet,
  findAllWallet,
  getWallet,
  getWalletCount,
  updateWallet,
  bulkUpdateWallet,
  partialUpdateWallet,
  softDeleteWallet,
  deleteWallet,
  deleteManyWallet,
  softDeleteManyWallet    
};