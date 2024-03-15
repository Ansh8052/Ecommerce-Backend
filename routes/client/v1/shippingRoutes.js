/**
 * shippingRoutes.js
 * @description :: CRUD API routes for shipping
 */

const express = require('express');
const router = express.Router();
const shippingController = require('../../../controller/client/v1/shippingController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/client/api/v1/shipping/create').post(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.addShipping);
router.route('/client/api/v1/shipping/list').post(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.findAllShipping);
router.route('/client/api/v1/shipping/count').post(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.getShippingCount);
router.route('/client/api/v1/shipping/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.getShipping);
router.route('/client/api/v1/shipping/update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.updateShipping);    
router.route('/client/api/v1/shipping/partial-update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.partialUpdateShipping);
router.route('/client/api/v1/shipping/softDelete/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.softDeleteShipping);
router.route('/client/api/v1/shipping/softDeleteMany').put(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.softDeleteManyShipping);
router.route('/client/api/v1/shipping/addBulk').post(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.bulkInsertShipping);
router.route('/client/api/v1/shipping/updateBulk').put(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.bulkUpdateShipping);
router.route('/client/api/v1/shipping/delete/:id').delete(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.deleteShipping);
router.route('/client/api/v1/shipping/deleteMany').post(auth(PLATFORM.CLIENT),checkRolePermission,shippingController.deleteManyShipping);

module.exports = router;
