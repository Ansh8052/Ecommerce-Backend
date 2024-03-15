/**
 * pincodeValidation.js
 * @description :: validate each post and put request as per pincode model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of pincode */
exports.schemaKeys = joi.object({
  pincode: joi.string().allow(null).allow(''),
  cityId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  stateId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  countryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of pincode for updation */
exports.updateSchemaKeys = joi.object({
  pincode: joi.string().allow(null).allow(''),
  cityId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  stateId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  countryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of pincode for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      pincode: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      cityId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      stateId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      countryId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
