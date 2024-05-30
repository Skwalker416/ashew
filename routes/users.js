const express = require('express');
const router = express.Router();
const users = require('../models/user');
const { Users } = require('../models/user');

const usersController = require('../controllers/users');
const cartController = require('../controllers/cart');

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
//wishList


//Cart
router.get('/:id/cart', cartController.getUserCart);
router.get('/:id/cart/count', cartController.getUserCartCount);
router.get('/:id/cart/:cartProductId', cartController.getCartProductById);
router.get('/:id/cart/:cartEventId', cartController.getCartEventById);
router.post('/:id/cart', cartController.addToCart);
router.put('/:id/cart/', cartController.modifyProductQuantity);
router.put('/:id/cart/', cartController.modifyEventQuantity);
router.delete('/:id/cart/:cartProductId', cartController.removeFromCart);
router.delete('/:id/cart/:cartEventId', cartController.removeFromCart);
module.exports = router;