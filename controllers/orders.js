const { default: mongoose } = require('mongoose');
const { Product } = require('../models/product');
const { Event } = require('../models/event');
const { CartProduct } = require('../models/cart_product');
const { CartEvent } = require('../models/cart_event');
const { OrderItem } = require('../models/order_item');
const { Order } = require('../models/order');
const { User } = require('../models/user');
const axios = require('axios');
const nanoid = require('nanoid');
const crypto = require('crypto');


exports.createOrder = async(req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({
                msg: "productId is required",
            });
        }
        // fetching the product from our database
        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({
                msg: "Product not found",
            });
        }
        // txRef is a unique identifier that will be sent to chapa and later get used to verify the payment transaction
        const txRef = nanoid();

        const order = {
            productId: product._id,
            productName: product.title,
            productPrice: product.price,
            txRef: txRef,
        };
        // creating our order
        await Order.create(order);

        // building the chapa request with the necessary data's
        // note that additional fields can be set as well, like phoneNumber, email ...
        let chapaRequestData = {
            amount: product.price,
            tx_ref: txRef,
            currency: "ETB",
        };

        // making a request to chapa server
        const response = await axios.post(
            `https://api.chapa.co/v1/transaction/mobile-initialize`,
            chapaRequestData, {
                headers: {
                    Authorization: "Bearer " + process.env.CHAPA_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        // check if successful
        if (response.data["status"] == "success") {
            return res.json({
                msg: "Order created successfully. Perform payment.",
                paymentUrl: response.data["data"]["checkout_url"],
            });
        } else {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }
    } catch (error) {
        if (error.response) {
            return res.status(500).json({
                msg: error.response.data,
            });
        } else {
            return res.status(500).json({
                msg: error,
            });
        }
    }
};


exports.verifyPayment = async(req, res) => {
    try {
        //validate that this was indeed sent by Chapa's server
        // this is where we use the Secret hash we saved in .env
        const hash = crypto
            .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex");
        if (hash == req.headers["x-chapa-signature"]) {
            // Retrieve the request's body
            const event = req.body;

            const { tx_ref, status } = event;
            if (status == "success" && tx_ref) {
                // hit the verify endpoint to make sure a transaction with the given
                // tx_ref was successful
                const response = await axios.get(
                    `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,

                    {
                        headers: {
                            Authorization: "Bearer " + process.env.CHAPA_KEY,
                        },
                    }
                );
                if (response.status == 200) {
                    // if successful find the order
                    if (response.data["status"] == "success") {
                        let tx_ref = response.data["data"]["tx_ref"];
                        const order = await OrderCollection.findOne({
                            txRef: tx_ref,
                        });
                        // check if the order doesn't exist or payment status is not pending
                        if (!order || order.paymentStatus != "pending") {
                            // Return a response to acknowledge receipt of the event
                            return res.sendStatus(200);
                        }
                        // change payment status to completed
                        if (order.paymentStatus == "pending") {
                            order.paymentStatus = "completed";
                            await order.save();
                            // Return a response to acknowledge receipt of the event
                            return res.sendStatus(200);
                        }
                    }
                }
            }
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

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