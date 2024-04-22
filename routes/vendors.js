const express = require('express');
const router = express.Router();

const vendorsController = require('../controllers/vendors');

router.get('/', vendorsController.getVendors);
router.get('/:id', vendorsController.getVendorById);
router.put('/:id', vendorsController.updateVendor);
router.put('/:id', vendorsController.addVendorProduct); // Work in theory to add vendor product  towards controller's vendor
module.exports = router;