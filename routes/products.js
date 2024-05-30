const express = require('express');
const router = express.Router();
const productsController = require('../controllers/vendor/products');
const reviewsController = require('../controllers/reviews');
const { verifyVendor } = require('../middlewares/verifyToken');


// router.get('/', productsController.getProducts);

router.get('/search', productsController.searchProducts);


router.post('/:id/reviews', reviewsController.leaveReview);
router.post('/:id/reviews', reviewsController.getProductReviews);



router.post("/", verifyVendor, productsController.addProduct);

router.get("/recommendation/:code", productsController.getRandomProduct);

router.get("/byCode/:code", productsController.getAllProductsByCode);

router.get("/:id", productsController.getProductById);

router.get("/vendor-products/:id", productsController.getProductsByVendor);

router.get("/search/:search", productsController.searchProducts);

router.get("/:category/:code", productsController.getProductsByCategoryAndCode);





module.exports = router;