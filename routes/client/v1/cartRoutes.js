/**
 * cartRoutes.js
 * @description :: CRUD API routes for cart
 */

const express = require('express');
const router = express.Router();
const cartController = require('../../../controller/client/v1/cartController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/client/api/v1/cart/create').post(auth(PLATFORM.CLIENT),checkRolePermission,cartController.addCart);
router.route('/client/api/v1/cart/list').post(auth(PLATFORM.CLIENT),checkRolePermission,cartController.findAllCart);
router.route('/client/api/v1/cart/count').post(auth(PLATFORM.CLIENT),checkRolePermission,cartController.getCartCount);
router.route('/client/api/v1/cart/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,cartController.getCart);
router.route('/client/api/v1/cart/update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,cartController.updateCart);    
router.route('/client/api/v1/cart/partial-update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,cartController.partialUpdateCart);
router.route('/client/api/v1/cart/softDelete/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,cartController.softDeleteCart);
router.route('/client/api/v1/cart/softDeleteMany').put(auth(PLATFORM.CLIENT),checkRolePermission,cartController.softDeleteManyCart);
router.route('/client/api/v1/cart/addBulk').post(auth(PLATFORM.CLIENT),checkRolePermission,cartController.bulkInsertCart);
router.route('/client/api/v1/cart/updateBulk').put(auth(PLATFORM.CLIENT),checkRolePermission,cartController.bulkUpdateCart);
router.route('/client/api/v1/cart/delete/:id').delete(auth(PLATFORM.CLIENT),checkRolePermission,cartController.deleteCart);
router.route('/client/api/v1/cart/deleteMany').post(auth(PLATFORM.CLIENT),checkRolePermission,cartController.deleteManyCart);

module.exports = router;
