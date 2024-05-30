const { Order } = require('../../models/order');
const { OrderItem } = require('../../models/order_item');


exports.getOrders = async function(_, res) {
    try {
        const orders = await Order.find()
            .select('-statusHistory') //put in everything in everything EXCEPT the status history  from ../../models/order STATUS schema 
            .populate('user', 'firstName lastName email') //expand this id in to its reference collection
            .sort({ dateOrdered: -1 }) //order in newest to the newest
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    select: 'name',
                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                }
            })
        if (!orders) {
            return res.status(404).json({ message: 'Orders not found!' })
        }
        return res.json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.getOrdersCount = async function(req, res) {
    try {
        const count = await Order.countDocuments();
        if (!count) {
            return res.status(500).json({ message: 'Could not count orders' }) //error status 500 because we are the ones making a mistake
        }
        return res.json({ count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.changeOrderStatus = async function(req, res) {
    try {
        const orderId = req.params.id;
        const newStatus = req.body.status; //admin will send a new status in the request body

        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' })
        }

        order.status = newStatus;
        if (!order.statusHistory.includes(order.status)) {
            order.statusHistory.push(order.status);
        }
        order.status = newStatus;
        order = await order.save();
        return res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.deleteOrder = async function(req, res) {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        for (const orderItemId of order.orderItems) {
            await OrderItem.findByIdAndDelete(orderItemId);
            // how exactly are we doing this after deleting the order ??? Bc when we delete it actually gets the order back
        }
        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};