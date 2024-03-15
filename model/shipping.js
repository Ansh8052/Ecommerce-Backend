/**
 * shipping.js
 * @description :: model of a database collection shipping
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
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

    orderId:{ type:String },

    courierCompany:{ type:String },

    deliveryStartDate:{ type:Date },

    EstimatedDeliveryDate:{ type:Date },

    ActualDeliveryDate:{ type:Date },

    isPrepaid:{ type:Boolean },

    isReturned:{ type:Boolean },

    returningReason:{ type:String },

    returnPickupDate:{ type:Date },

    isReturnDamaged:{ type:Boolean },

    returnRecievedDate:{ type:Date },

    shippingStatus:{
      type:Number,
      default:1
    },

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

    deliveryAddress:{
      pincode:{ type:String },
      address1:{ type:String },
      address2:{ type:String },
      landmark:{ type:String },
      city:{ type:String },
      isDefault:{ type:Boolean },
      state:{ type:String },
      addressType:{ type:String },
      fullName:{ type:String },
      mobileNo:{ type:Number },
      addressNo:{ type:Number }
    },

    isDeleted:{ type:Boolean }
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

schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const shipping = mongoose.model('shipping',schema);
module.exports = shipping;