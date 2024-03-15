/**
 * productValidation.js
 * @description :: validate each post and put request as per product model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of product */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  price: joi.number().integer().allow(0),
  sellerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  brand: joi.string().allow(null).allow(''),
  category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  subCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of product for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  price: joi.number().integer().allow(0),
  sellerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  brand: joi.string().allow(null).allow(''),
  category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  subCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of product for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      price: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      sellerId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      brand: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      category: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      subCategory: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
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
