/**
 * walletTransactionValidation.js
 * @description :: validate each post and put request as per walletTransaction model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of walletTransaction */
exports.schemaKeys = joi.object({
  walletId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  forOrder: joi.boolean(),
  forWallet: joi.boolean(),
  transactionAmount: joi.number().integer().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of walletTransaction for updation */
exports.updateSchemaKeys = joi.object({
  walletId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  forOrder: joi.boolean(),
  forWallet: joi.boolean(),
  transactionAmount: joi.number().integer().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of walletTransaction for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      walletId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      userId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      forOrder: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      forWallet: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      transactionAmount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
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
