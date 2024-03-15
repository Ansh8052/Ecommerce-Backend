/**
 * bannerValidation.js
 * @description :: validate each post and put request as per banner model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of banner */
exports.schemaKeys = joi.object({
  bannerTitle: joi.string().allow(null).allow(''),
  alternateTitle: joi.string().allow(null).allow(''),
  startDate: joi.date().options({ convert: true }).allow(null).allow(''),
  endDate: joi.date().options({ convert: true }).allow(null).allow(''),
  images: joi.array().items(),
  redirectLink: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  sellerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of banner for updation */
exports.updateSchemaKeys = joi.object({
  bannerTitle: joi.string().allow(null).allow(''),
  alternateTitle: joi.string().allow(null).allow(''),
  startDate: joi.date().options({ convert: true }).allow(null).allow(''),
  endDate: joi.date().options({ convert: true }).allow(null).allow(''),
  images: joi.array().items(),
  redirectLink: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  sellerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of banner for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      bannerTitle: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      alternateTitle: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      startDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      endDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      images: joi.alternatives().try(joi.array().items(),joi.array().items(),joi.object()),
      redirectLink: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      sellerId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
