/**
 * bannerRoutes.js
 * @description :: CRUD API routes for banner
 */

const express = require('express');
const router = express.Router();
const bannerController = require('../../../controller/client/v1/bannerController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/client/api/v1/banner/create').post(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.addBanner);
router.route('/client/api/v1/banner/list').post(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.findAllBanner);
router.route('/client/api/v1/banner/count').post(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.getBannerCount);
router.route('/client/api/v1/banner/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.getBanner);
router.route('/client/api/v1/banner/update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.updateBanner);    
router.route('/client/api/v1/banner/partial-update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.partialUpdateBanner);
router.route('/client/api/v1/banner/softDelete/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.softDeleteBanner);
router.route('/client/api/v1/banner/softDeleteMany').put(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.softDeleteManyBanner);
router.route('/client/api/v1/banner/addBulk').post(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.bulkInsertBanner);
router.route('/client/api/v1/banner/updateBulk').put(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.bulkUpdateBanner);
router.route('/client/api/v1/banner/delete/:id').delete(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.deleteBanner);
router.route('/client/api/v1/banner/deleteMany').post(auth(PLATFORM.CLIENT),checkRolePermission,bannerController.deleteManyBanner);

module.exports = router;
