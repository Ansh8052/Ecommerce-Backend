/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let User = require('../model/user');
let Product = require('../model/product');
let Category = require('../model/category');
let Order = require('../model/order');
let Banner = require('../model/banner');
let Cart = require('../model/cart');
let Country = require('../model/country');
let City = require('../model/city');
let Pincode = require('../model/pincode');
let State = require('../model/state');
let Wallet = require('../model/wallet');
let WalletTransaction = require('../model/walletTransaction');
let Shipping = require('../model/shipping');
let UserTokens = require('../model/userTokens');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');

const deleteUser = async (filter) =>{
  try {
    let user = await dbService.findMany(User,filter);
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const userFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userCnt = await dbService.deleteMany(User,userFilter);

      const productFilter = { $or: [{ sellerId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const productCnt = await dbService.deleteMany(Product,productFilter);

      const categoryFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const categoryCnt = await dbService.deleteMany(Category,categoryFilter);

      const orderFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const orderCnt = await dbService.deleteMany(Order,orderFilter);

      const bannerFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } },{ sellerId : { $in : user } }] };
      const bannerCnt = await dbService.deleteMany(Banner,bannerFilter);

      const cartFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const cartCnt = await dbService.deleteMany(Cart,cartFilter);

      const countryFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const countryCnt = await dbService.deleteMany(Country,countryFilter);

      const cityFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const cityCnt = await dbService.deleteMany(City,cityFilter);

      const pincodeFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const pincodeCnt = await dbService.deleteMany(Pincode,pincodeFilter);

      const stateFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const stateCnt = await dbService.deleteMany(State,stateFilter);

      const walletFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletCnt = await dbService.deleteMany(Wallet,walletFilter);

      const walletTransactionFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletTransactionCnt = await dbService.deleteMany(WalletTransaction,walletTransactionFilter);

      const shippingFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const shippingCnt = await dbService.deleteMany(Shipping,shippingFilter);

      const userTokensFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userTokensCnt = await dbService.deleteMany(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const roleCnt = await dbService.deleteMany(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const projectRouteCnt = await dbService.deleteMany(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(User,filter);
      let response = {
        user :userCnt + deleted,
        product :productCnt,
        category :categoryCnt,
        order :orderCnt,
        banner :bannerCnt,
        cart :cartCnt,
        country :countryCnt,
        city :cityCnt,
        pincode :pincodeCnt,
        state :stateCnt,
        wallet :walletCnt,
        walletTransaction :walletTransactionCnt,
        shipping :shippingCnt,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProduct = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Product,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCategory = async (filter) =>{
  try {
    let category = await dbService.findMany(Category,filter);
    if (category && category.length){
      category = category.map((obj) => obj.id);

      const productFilter = { $or: [{ category : { $in : category } },{ subCategory : { $in : category } }] };
      const productCnt = await dbService.deleteMany(Product,productFilter);

      const categoryFilter = { $or: [{ parentCategoryId : { $in : category } }] };
      const categoryCnt = await dbService.deleteMany(Category,categoryFilter);

      let deleted  = await dbService.deleteMany(Category,filter);
      let response = {
        product :productCnt,
        category :categoryCnt + deleted,
      };
      return response; 
    } else {
      return {  category : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteOrder = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Order,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteBanner = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Banner,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCart = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Cart,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCountry = async (filter) =>{
  try {
    let country = await dbService.findMany(Country,filter);
    if (country && country.length){
      country = country.map((obj) => obj.id);

      const pincodeFilter = { $or: [{ countryId : { $in : country } }] };
      const pincodeCnt = await dbService.deleteMany(Pincode,pincodeFilter);

      const stateFilter = { $or: [{ countryId : { $in : country } }] };
      const stateCnt = await dbService.deleteMany(State,stateFilter);

      let deleted  = await dbService.deleteMany(Country,filter);
      let response = {
        pincode :pincodeCnt,
        state :stateCnt,
      };
      return response; 
    } else {
      return {  country : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCity = async (filter) =>{
  try {
    let city = await dbService.findMany(City,filter);
    if (city && city.length){
      city = city.map((obj) => obj.id);

      const pincodeFilter = { $or: [{ cityId : { $in : city } }] };
      const pincodeCnt = await dbService.deleteMany(Pincode,pincodeFilter);

      let deleted  = await dbService.deleteMany(City,filter);
      let response = { pincode :pincodeCnt, };
      return response; 
    } else {
      return {  city : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deletePincode = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Pincode,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteState = async (filter) =>{
  try {
    let state = await dbService.findMany(State,filter);
    if (state && state.length){
      state = state.map((obj) => obj.id);

      const cityFilter = { $or: [{ stateId : { $in : state } }] };
      const cityCnt = await dbService.deleteMany(City,cityFilter);

      const pincodeFilter = { $or: [{ stateId : { $in : state } }] };
      const pincodeCnt = await dbService.deleteMany(Pincode,pincodeFilter);

      let deleted  = await dbService.deleteMany(State,filter);
      let response = {
        city :cityCnt,
        pincode :pincodeCnt,
      };
      return response; 
    } else {
      return {  state : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteWallet = async (filter) =>{
  try {
    let wallet = await dbService.findMany(Wallet,filter);
    if (wallet && wallet.length){
      wallet = wallet.map((obj) => obj.id);

      const walletTransactionFilter = { $or: [{ walletId : { $in : wallet } }] };
      const walletTransactionCnt = await dbService.deleteMany(WalletTransaction,walletTransactionFilter);

      let deleted  = await dbService.deleteMany(Wallet,filter);
      let response = { walletTransaction :walletTransactionCnt, };
      return response; 
    } else {
      return {  wallet : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteWalletTransaction = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(WalletTransaction,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteShipping = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Shipping,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserTokens,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(Role,filter);
      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      let deleted  = await dbService.deleteMany(ProjectRoute,filter);
      let response = { routeRole :routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await dbService.findMany(User,filter);
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const userFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const productFilter = { $or: [{ sellerId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const productCnt =  await dbService.count(Product,productFilter);

      const categoryFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const categoryCnt =  await dbService.count(Category,categoryFilter);

      const orderFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const orderCnt =  await dbService.count(Order,orderFilter);

      const bannerFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } },{ sellerId : { $in : user } }] };
      const bannerCnt =  await dbService.count(Banner,bannerFilter);

      const cartFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const cartCnt =  await dbService.count(Cart,cartFilter);

      const countryFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const countryCnt =  await dbService.count(Country,countryFilter);

      const cityFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const cityCnt =  await dbService.count(City,cityFilter);

      const pincodeFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const pincodeCnt =  await dbService.count(Pincode,pincodeFilter);

      const stateFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const stateCnt =  await dbService.count(State,stateFilter);

      const walletFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletCnt =  await dbService.count(Wallet,walletFilter);

      const walletTransactionFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletTransactionCnt =  await dbService.count(WalletTransaction,walletTransactionFilter);

      const shippingFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const shippingCnt =  await dbService.count(Shipping,shippingFilter);

      const userTokensFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userTokensCnt =  await dbService.count(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const roleCnt =  await dbService.count(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const projectRouteCnt =  await dbService.count(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        user : userCnt,
        product : productCnt,
        category : categoryCnt,
        order : orderCnt,
        banner : bannerCnt,
        cart : cartCnt,
        country : countryCnt,
        city : cityCnt,
        pincode : pincodeCnt,
        state : stateCnt,
        wallet : walletCnt,
        walletTransaction : walletTransactionCnt,
        shipping : shippingCnt,
        userTokens : userTokensCnt,
        role : roleCnt,
        projectRoute : projectRouteCnt,
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProduct = async (filter) =>{
  try {
    const productCnt =  await dbService.count(Product,filter);
    return { product : productCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countCategory = async (filter) =>{
  try {
    let category = await dbService.findMany(Category,filter);
    if (category && category.length){
      category = category.map((obj) => obj.id);

      const productFilter = { $or: [{ category : { $in : category } },{ subCategory : { $in : category } }] };
      const productCnt =  await dbService.count(Product,productFilter);

      const categoryFilter = { $or: [{ parentCategoryId : { $in : category } }] };
      const categoryCnt =  await dbService.count(Category,categoryFilter);

      let response = {
        product : productCnt,
        category : categoryCnt,
      };
      return response; 
    } else {
      return {  category : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrder = async (filter) =>{
  try {
    const orderCnt =  await dbService.count(Order,filter);
    return { order : orderCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countBanner = async (filter) =>{
  try {
    const bannerCnt =  await dbService.count(Banner,filter);
    return { banner : bannerCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countCart = async (filter) =>{
  try {
    const cartCnt =  await dbService.count(Cart,filter);
    return { cart : cartCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countCountry = async (filter) =>{
  try {
    let country = await dbService.findMany(Country,filter);
    if (country && country.length){
      country = country.map((obj) => obj.id);

      const pincodeFilter = { $or: [{ countryId : { $in : country } }] };
      const pincodeCnt =  await dbService.count(Pincode,pincodeFilter);

      const stateFilter = { $or: [{ countryId : { $in : country } }] };
      const stateCnt =  await dbService.count(State,stateFilter);

      let response = {
        pincode : pincodeCnt,
        state : stateCnt,
      };
      return response; 
    } else {
      return {  country : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countCity = async (filter) =>{
  try {
    let city = await dbService.findMany(City,filter);
    if (city && city.length){
      city = city.map((obj) => obj.id);

      const pincodeFilter = { $or: [{ cityId : { $in : city } }] };
      const pincodeCnt =  await dbService.count(Pincode,pincodeFilter);

      let response = { pincode : pincodeCnt, };
      return response; 
    } else {
      return {  city : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countPincode = async (filter) =>{
  try {
    const pincodeCnt =  await dbService.count(Pincode,filter);
    return { pincode : pincodeCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countState = async (filter) =>{
  try {
    let state = await dbService.findMany(State,filter);
    if (state && state.length){
      state = state.map((obj) => obj.id);

      const cityFilter = { $or: [{ stateId : { $in : state } }] };
      const cityCnt =  await dbService.count(City,cityFilter);

      const pincodeFilter = { $or: [{ stateId : { $in : state } }] };
      const pincodeCnt =  await dbService.count(Pincode,pincodeFilter);

      let response = {
        city : cityCnt,
        pincode : pincodeCnt,
      };
      return response; 
    } else {
      return {  state : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countWallet = async (filter) =>{
  try {
    let wallet = await dbService.findMany(Wallet,filter);
    if (wallet && wallet.length){
      wallet = wallet.map((obj) => obj.id);

      const walletTransactionFilter = { $or: [{ walletId : { $in : wallet } }] };
      const walletTransactionCnt =  await dbService.count(WalletTransaction,walletTransactionFilter);

      let response = { walletTransaction : walletTransactionCnt, };
      return response; 
    } else {
      return {  wallet : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countWalletTransaction = async (filter) =>{
  try {
    const walletTransactionCnt =  await dbService.count(WalletTransaction,filter);
    return { walletTransaction : walletTransactionCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countShipping = async (filter) =>{
  try {
    const shippingCnt =  await dbService.count(Shipping,filter);
    return { shipping : shippingCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) =>{
  try {
    const userTokensCnt =  await dbService.count(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await dbService.count(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await dbService.count(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody) =>{  
  try {
    let user = await dbService.findMany(User,filter, { id:1 });
    if (user.length){
      user = user.map((obj) => obj.id);

      const userFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userCnt = await dbService.updateMany(User,userFilter,updateBody);

      const productFilter = { '$or': [{ sellerId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const productCnt = await dbService.updateMany(Product,productFilter,updateBody);

      const categoryFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const categoryCnt = await dbService.updateMany(Category,categoryFilter,updateBody);

      const orderFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const orderCnt = await dbService.updateMany(Order,orderFilter,updateBody);

      const bannerFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } },{ sellerId : { '$in' : user } }] };
      const bannerCnt = await dbService.updateMany(Banner,bannerFilter,updateBody);

      const cartFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const cartCnt = await dbService.updateMany(Cart,cartFilter,updateBody);

      const countryFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const countryCnt = await dbService.updateMany(Country,countryFilter,updateBody);

      const cityFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const cityCnt = await dbService.updateMany(City,cityFilter,updateBody);

      const pincodeFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const pincodeCnt = await dbService.updateMany(Pincode,pincodeFilter,updateBody);

      const stateFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const stateCnt = await dbService.updateMany(State,stateFilter,updateBody);

      const walletFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const walletCnt = await dbService.updateMany(Wallet,walletFilter,updateBody);

      const walletTransactionFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const walletTransactionCnt = await dbService.updateMany(WalletTransaction,walletTransactionFilter,updateBody);

      const shippingFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const shippingCnt = await dbService.updateMany(Shipping,shippingFilter,updateBody);

      const userTokensFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userTokensCnt = await dbService.updateMany(UserTokens,userTokensFilter,updateBody);

      const roleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const roleCnt = await dbService.updateMany(Role,roleFilter,updateBody);

      const projectRouteFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const projectRouteCnt = await dbService.updateMany(ProjectRoute,projectRouteFilter,updateBody);

      const routeRoleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(User,filter,updateBody);

      let response = {
        user :userCnt + updated,
        product :productCnt,
        category :categoryCnt,
        order :orderCnt,
        banner :bannerCnt,
        cart :cartCnt,
        country :countryCnt,
        city :cityCnt,
        pincode :pincodeCnt,
        state :stateCnt,
        wallet :walletCnt,
        walletTransaction :walletTransactionCnt,
        shipping :shippingCnt,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProduct = async (filter,updateBody) =>{  
  try {
    const productCnt =  await dbService.updateMany(Product,filter);
    return { product : productCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCategory = async (filter,updateBody) =>{  
  try {
    let category = await dbService.findMany(Category,filter, { id:1 });
    if (category.length){
      category = category.map((obj) => obj.id);

      const productFilter = { '$or': [{ category : { '$in' : category } },{ subCategory : { '$in' : category } }] };
      const productCnt = await dbService.updateMany(Product,productFilter,updateBody);

      const categoryFilter = { '$or': [{ parentCategoryId : { '$in' : category } }] };
      const categoryCnt = await dbService.updateMany(Category,categoryFilter,updateBody);
      let updated = await dbService.updateMany(Category,filter,updateBody);

      let response = {
        product :productCnt,
        category :categoryCnt + updated,
      };
      return response;
    } else {
      return {  category : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrder = async (filter,updateBody) =>{  
  try {
    const orderCnt =  await dbService.updateMany(Order,filter);
    return { order : orderCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteBanner = async (filter,updateBody) =>{  
  try {
    const bannerCnt =  await dbService.updateMany(Banner,filter);
    return { banner : bannerCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCart = async (filter,updateBody) =>{  
  try {
    const cartCnt =  await dbService.updateMany(Cart,filter);
    return { cart : cartCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCountry = async (filter,updateBody) =>{  
  try {
    let country = await dbService.findMany(Country,filter, { id:1 });
    if (country.length){
      country = country.map((obj) => obj.id);

      const pincodeFilter = { '$or': [{ countryId : { '$in' : country } }] };
      const pincodeCnt = await dbService.updateMany(Pincode,pincodeFilter,updateBody);

      const stateFilter = { '$or': [{ countryId : { '$in' : country } }] };
      const stateCnt = await dbService.updateMany(State,stateFilter,updateBody);
      let updated = await dbService.updateMany(Country,filter,updateBody);

      let response = {
        pincode :pincodeCnt,
        state :stateCnt,
      };
      return response;
    } else {
      return {  country : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCity = async (filter,updateBody) =>{  
  try {
    let city = await dbService.findMany(City,filter, { id:1 });
    if (city.length){
      city = city.map((obj) => obj.id);

      const pincodeFilter = { '$or': [{ cityId : { '$in' : city } }] };
      const pincodeCnt = await dbService.updateMany(Pincode,pincodeFilter,updateBody);
      let updated = await dbService.updateMany(City,filter,updateBody);

      let response = { pincode :pincodeCnt, };
      return response;
    } else {
      return {  city : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePincode = async (filter,updateBody) =>{  
  try {
    const pincodeCnt =  await dbService.updateMany(Pincode,filter);
    return { pincode : pincodeCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteState = async (filter,updateBody) =>{  
  try {
    let state = await dbService.findMany(State,filter, { id:1 });
    if (state.length){
      state = state.map((obj) => obj.id);

      const cityFilter = { '$or': [{ stateId : { '$in' : state } }] };
      const cityCnt = await dbService.updateMany(City,cityFilter,updateBody);

      const pincodeFilter = { '$or': [{ stateId : { '$in' : state } }] };
      const pincodeCnt = await dbService.updateMany(Pincode,pincodeFilter,updateBody);
      let updated = await dbService.updateMany(State,filter,updateBody);

      let response = {
        city :cityCnt,
        pincode :pincodeCnt,
      };
      return response;
    } else {
      return {  state : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteWallet = async (filter,updateBody) =>{  
  try {
    let wallet = await dbService.findMany(Wallet,filter, { id:1 });
    if (wallet.length){
      wallet = wallet.map((obj) => obj.id);

      const walletTransactionFilter = { '$or': [{ walletId : { '$in' : wallet } }] };
      const walletTransactionCnt = await dbService.updateMany(WalletTransaction,walletTransactionFilter,updateBody);
      let updated = await dbService.updateMany(Wallet,filter,updateBody);

      let response = { walletTransaction :walletTransactionCnt, };
      return response;
    } else {
      return {  wallet : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteWalletTransaction = async (filter,updateBody) =>{  
  try {
    const walletTransactionCnt =  await dbService.updateMany(WalletTransaction,filter);
    return { walletTransaction : walletTransactionCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteShipping = async (filter,updateBody) =>{  
  try {
    const shippingCnt =  await dbService.updateMany(Shipping,filter);
    return { shipping : shippingCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter,updateBody) =>{  
  try {
    const userTokensCnt =  await dbService.updateMany(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody) =>{  
  try {
    let role = await dbService.findMany(Role,filter, { id:1 });
    if (role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(Role,filter,updateBody);

      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody) =>{  
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter, { id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectroute } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);
      let updated = await dbService.updateMany(ProjectRoute,filter,updateBody);

      let response = { routeRole :routeRoleCnt, };
      return response;
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody) =>{  
  try {
    const routeRoleCnt =  await dbService.updateMany(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody) =>{  
  try {
    const userRoleCnt =  await dbService.updateMany(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteProduct,
  deleteCategory,
  deleteOrder,
  deleteBanner,
  deleteCart,
  deleteCountry,
  deleteCity,
  deletePincode,
  deleteState,
  deleteWallet,
  deleteWalletTransaction,
  deleteShipping,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countProduct,
  countCategory,
  countOrder,
  countBanner,
  countCart,
  countCountry,
  countCity,
  countPincode,
  countState,
  countWallet,
  countWalletTransaction,
  countShipping,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteProduct,
  softDeleteCategory,
  softDeleteOrder,
  softDeleteBanner,
  softDeleteCart,
  softDeleteCountry,
  softDeleteCity,
  softDeletePincode,
  softDeleteState,
  softDeleteWallet,
  softDeleteWalletTransaction,
  softDeleteShipping,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
