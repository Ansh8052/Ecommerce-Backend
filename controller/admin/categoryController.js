/**
 * categoryController.js
 * @description : exports action methods for category.
 */

const Category = require('../../model/category');
const categorySchemaKey = require('../../utils/validation/categoryValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Category in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Category. {status, message, data}
 */ 
const addCategory = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      categorySchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Category(dataToCreate);
    let createdCategory = await dbService.create(Category,dataToCreate);
    return res.success({ data : createdCategory });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Category in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Categorys. {status, message, data}
 */
const bulkInsertCategory = async (req,res)=>{
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
    let createdCategorys = await dbService.create(Category,dataToCreate);
    createdCategorys = { count: createdCategorys ? createdCategorys.length : 0 };
    return res.success({ data:{ count:createdCategorys.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Category from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Category(s). {status, message, data}
 */
const findAllCategory = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      categorySchemaKey.findFilterKeys,
      Category.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Category, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundCategorys = await dbService.paginate( Category,query,options);
    if (!foundCategorys || !foundCategorys.data || !foundCategorys.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundCategorys });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Category from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Category. {status, message, data}
 */
const getCategory = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundCategory = await dbService.findOne(Category,query, options);
    if (!foundCategory){
      return res.recordNotFound();
    }
    return res.success({ data :foundCategory });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Category.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getCategoryCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      categorySchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedCategory = await dbService.count(Category,where);
    return res.success({ data : { count: countedCategory } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Category with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Category.
 * @return {Object} : updated Category. {status, message, data}
 */
const updateCategory = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      categorySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCategory = await dbService.updateOne(Category,query,dataToUpdate);
    if (!updatedCategory){
      return res.recordNotFound();
    }
    return res.success({ data :updatedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Category with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Categorys.
 * @return {Object} : updated Categorys. {status, message, data}
 */
const bulkUpdateCategory = async (req,res)=>{
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
    let updatedCategory = await dbService.updateMany(Category,filter,dataToUpdate);
    if (!updatedCategory){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedCategory } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Category with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Category.
 * @return {obj} : updated Category. {status, message, data}
 */
const partialUpdateCategory = async (req,res) => {
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
      categorySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedCategory = await dbService.updateOne(Category, query, dataToUpdate);
    if (!updatedCategory) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Category from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Category.
 * @return {Object} : deactivated Category. {status, message, data}
 */
const softDeleteCategory = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedCategory = await deleteDependentService.softDeleteCategory(query, updateBody);
    if (!updatedCategory){
      return res.recordNotFound();
    }
    return res.success({ data:updatedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Category from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Category. {status, message, data}
 */
const deleteCategory = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedCategory;
    if (req.body.isWarning) { 
      deletedCategory = await deleteDependentService.countCategory(query);
    } else {
      deletedCategory = await deleteDependentService.deleteCategory(query);
    }
    if (!deletedCategory){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCategory });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Category in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyCategory = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedCategory;
    if (req.body.isWarning) {
      deletedCategory = await deleteDependentService.countCategory(query);
    }
    else {
      deletedCategory = await deleteDependentService.deleteCategory(query);
    }
    if (!deletedCategory){
      return res.recordNotFound();
    }
    return res.success({ data :deletedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Category from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Category.
 * @return {Object} : number of deactivated documents of Category. {status, message, data}
 */
const softDeleteManyCategory = async (req,res) => {
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
    let updatedCategory = await deleteDependentService.softDeleteCategory(query, updateBody);
    if (!updatedCategory) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedCategory });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addCategory,
  bulkInsertCategory,
  findAllCategory,
  getCategory,
  getCategoryCount,
  updateCategory,
  bulkUpdateCategory,
  partialUpdateCategory,
  softDeleteCategory,
  deleteCategory,
  deleteManyCategory,
  softDeleteManyCategory    
};