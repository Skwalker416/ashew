const express = require('express');
const router = express.Router();

const vendorsController = require('../controllers/vendor/vendors');
const productsController = require('../controllers/vendor/products');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');
//controller/vendor/products
router.post('/products', productsController.addProduct);
// router.put('/products/:id', productsController.editProduct);
// router.get('/products/', productsController.getProducts);

//controller/vendor/vendors
// router.get('/vendors', vendorsController.getVendors);
// router.get('vendors/:id', vendorsController.getVendorById);
// router.put('vendors/:id', vendorsController.updateVendor);
// router.put('vendors/:id', vendorsController.addVendorProduct); // Work in theory to add vendor product  towards controller's vendor




router.post("/", verifyTokenAndAuthorization, vendorsController.addVendor);

router.get("/:code", vendorsController.getRandomVendors);

// router.get("/all/:code", vendorsController.getAllNearByVendors);

router.get("/byId/:id", vendorsController.getVendorById);




module.exports = router;