/**
 * shippingValidation.js
 * @description :: validate each post and put request as per shipping model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of shipping */
exports.schemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  courierCompany: joi.string().allow(null).allow(''),
  deliveryStartDate: joi.date().options({ convert: true }).allow(null).allow(''),
  EstimatedDeliveryDate: joi.date().options({ convert: true }).allow(null).allow(''),
  ActualDeliveryDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isPrepaid: joi.boolean(),
  isReturned: joi.boolean(),
  returningReason: joi.string().allow(null).allow(''),
  returnPickupDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isReturnDamaged: joi.boolean(),
  returnRecievedDate: joi.date().options({ convert: true }).allow(null).allow(''),
  shippingStatus: joi.number().integer().default(1).allow(0),
  isActive: joi.boolean(),
  deliveryAddress: joi.object({
    pincode:joi.string(),
    address1:joi.string(),
    address2:joi.string(),
    landmark:joi.string(),
    city:joi.string(),
    isDefault:joi.boolean(),
    state:joi.string(),
    addressType:joi.string(),
    fullName:joi.string(),
    mobileNo:joi.number().integer(),
    addressNo:joi.number().integer()
  }).allow(0),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of shipping for updation */
exports.updateSchemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  courierCompany: joi.string().allow(null).allow(''),
  deliveryStartDate: joi.date().options({ convert: true }).allow(null).allow(''),
  EstimatedDeliveryDate: joi.date().options({ convert: true }).allow(null).allow(''),
  ActualDeliveryDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isPrepaid: joi.boolean(),
  isReturned: joi.boolean(),
  returningReason: joi.string().allow(null).allow(''),
  returnPickupDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isReturnDamaged: joi.boolean(),
  returnRecievedDate: joi.date().options({ convert: true }).allow(null).allow(''),
  shippingStatus: joi.number().integer().default(1).allow(0),
  isActive: joi.boolean(),
  deliveryAddress: joi.object({
    pincode:joi.string(),
    address1:joi.string(),
    address2:joi.string(),
    landmark:joi.string(),
    city:joi.string(),
    isDefault:joi.boolean(),
    state:joi.string(),
    addressType:joi.string(),
    fullName:joi.string(),
    mobileNo:joi.number().integer(),
    addressNo:joi.number().integer()
  }).allow(0),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of shipping for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      orderId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      courierCompany: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      deliveryStartDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      EstimatedDeliveryDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      ActualDeliveryDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      isPrepaid: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isReturned: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      returningReason: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      returnPickupDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      isReturnDamaged: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      returnRecievedDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      shippingStatus: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      deliveryAddress: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
