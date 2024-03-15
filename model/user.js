/**
 * user.js
 * @description :: model of a database collection user
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const bcrypt = require('bcrypt');
const { USER_TYPES } = require('../constants/authConstant').default;
const { convertObjectToEnum } = require('../utils/common');
const authConstantEnum = require('../constants/authConstant').default;
        
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    username:{ type:String },

    password:{ type:String },

    email:{ type:String },

    name:{ type:String },

    isActive:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    updatedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    shippingAddress:[{
      _id:false,
      pincode:{ type:String },
      address1:{ type:String },
      address2:{ type:String },
      landmark:{ type:String },
      city:{ type:String },
      isDefault:{ type:Boolean },
      state:{ type:String },
      addressType:{ type:String },
      fullName:{ type:String },
      mobile:{
        type:Number,
        min:10,
        max:10
      },
      addressNo:{ type:Number }
    }],

    wishlist:[{
      _id:false,
      productId:{ type:String }
    }],

    userType:{
      type:Number,
      enum:convertObjectToEnum(USER_TYPES),
      required:true
    },

    mobileNo:{ type:String },

    isDeleted:{ type:Boolean },

    resetPasswordLink:{
      code:String,
      expireTime:Date
    },

    loginRetryLimit:{
      type:Number,
      default:0
    },

    loginReactiveTime:{ type:Date }
  }
  ,{ 
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password){
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length){
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
  delete object.password;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const user = mongoose.model('user',schema);
module.exports = user;