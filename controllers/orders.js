const { default: mongoose } = require('mongoose');
const { Product } = require('../models/product');
const { Event } = require('../models/event');
const { CartProduct } = require('../models/cart_product');
const { CartEvent } = require('../models/cart_event');
const { OrderItem } = require('../models/order_item');
const { Order } = require('../models/order');
const { User } = require('../models/user');
exports.addOrder = async function(orderData) {
    if (!mongoose.isValidObjectId(orderData.user)) {
        return console.error('User validation failed: Invalid user!')
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(orderData.user);
        if (!user) {
            await session.abortTransaction();
            return console.trace('ORDER CREATION FAILED: user nor found');

        }
        const orderItems = orderData.orderItems;
        const orderItemsIds = [];

        for (const orderItem of orderItems) {
            if (!mongoose.isValidObjectId(orderItem.product) || !(await Product.findById(orderItem.product))) {
                await session.abortTransaction();
                return console.trace('ORDER CREATION FAILED: Invalid product in the order');
                // Exit the function after aborting the transaction
            }

            if (!mongoose.isValidObjectId(orderItem.event) || !(await Event.findById(orderItem.event))) {
                await session.abortTransaction();
                return console.trace('ORDER CREATION FAILED: Invalid event in the order');
                // Exit the function after aborting the transaction
            }
            const product = await Product.findById(orderItem.product);
            const event = await Event.findById(orderItem.event);
            const cartProduct = await CartProduct.findById(orderItems.cartProduct);
            if (!cartProduct) {
                await session.abortTransaction();
                return console.trace('ORDER CREATION FAILED: Invalid cart product in the order');

            }
            const cartEvent = await CartEvent.findById(orderItems.cartEvent);
            if (!cartEvent) {
                await session.abortTransaction();
                return console.trace('ORDER CREATION FAILED: Invalid cart event in the order');

            }
            let orderItemModel = await new OrderItem(orderItem).save({ session });


            if (!orderItemModel) {
                await session.abortTransaction();
                console.trace('ORDER CREATION FAILED:', `An order for "${product.name || event.name }" could not be created`);
            }
            if (!cartProduct.reserved) {
                product.countInStock -= orderItemModel.quantity;
                await product.save({ session });
            }
            if (!cartEvent.reserved) {
                event.countInStock -= orderItemModel.quantity;
                await event.save({ session });
            }
            orderItemsIds.push(orderItemModel._id);

            await cartProduct.findByIdAndDelete(orderItem.cartProductId).session(session);
            await cartEvent.findByIdAndDelete(orderItem.cartEventId).session(session);
            user.cart.pull(cartProduct.id);
            user.cart.pull(cartEvent.id);
            await user.save({ session });

        }

        orderData['orderItems'] = orderItemsIds; //replaced the order item and going to use the ids to create order
        let order = new Order(orderData);
        order.status = 'processed';
        order.statusHistory.push('processed'); //going to change from pending to processed 

        order = await order.save({ session });

        if (!order) {
            await session.abortTransaction();
            return console.trace('ORDER CREATION FAILED: The order could not be created.');

        }

        await session.commitTransaction();
        return order;
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return console.trace(error);
    } finally {
        await session.endSession();
    }

};

exports.getUserOrders = async function(req, res) {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .select('orderItems status totalPrice dateOrdered')
            .populate({ path: 'orderItems', select: 'productName, productImage' })
            .sort({ dateOrdered: -1 });

        if (!orders) {
            return res.status(404).json({ message: 'Product not found' })
        }
        const completed = [];
        const active = [];
        const cancelled = [];
        for (const order of orders) {
            if (order.status === 'delivered') {
                completed.push(order);
            } else if (['canceled', 'expired'].includes(order.status)) {
                cancelled.push(order);
            } else {
                active.push(order);
            }
        }

        return res.json({ total: orders.length, active, completed, cancelled });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.getOrderById = async function(req, res) {
    try {

        const order = await Order.findById(req.params.id).populate('orderItems');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });

        }
        return res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
}