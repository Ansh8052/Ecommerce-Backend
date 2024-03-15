/**
 * cartValidation.js
 * @description :: validate each post and put request as per cart model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of cart */
exports.schemaKeys = joi.object({
  customerId: joi.string().allow(null).allow(''),
  isVisible: joi.string().allow(null).allow(''),
  cartItems: joi.array().items(joi.object()),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of cart for updation */
exports.updateSchemaKeys = joi.object({
  customerId: joi.string().allow(null).allow(''),
  isVisible: joi.string().allow(null).allow(''),
  cartItems: joi.array().items(joi.object()),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of cart for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      customerId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isVisible: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
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
