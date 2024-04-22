const { Token } = require('../../models/token');
const { User } = require('../../models/user');
const { Order } = require('../../models/order');
const { OrderItem } = require('../../models/order_item');
const { Ticket } = require('../../models/ticket');
const { TicketItem } = require('../../models/ticket_item');

exports.getUserCount = async function(req, res) {
    try {
        const userCount = await User.countDocuments();


        if (!userCount) {
            return res.status(500).json({ message: `Could not count User` });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }

};
exports.deleteUser = async function(req, res) {
    try {
        const userId = req.params.id; //gets user id form admin routes user:_id


        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: `User not found` });
        };

        //deleting orders/tickets where the user matches the userId
        const orders = await Order.find({ user: userId });
        const orderItemIds = orders.flatMap((order) = order.OrderItems)
        const tickets = await Order.find({ user: userId });
        const ticketItemIds = tickets.flatMap((ticket) = ticket.TicketItems)

        await Order.deleteMany({ user: userId });
        await OrderItem.deleteMany({ _id: { $in: orderItemIds } });

        await Ticket.deleteMany({ user: userId });
        await TicketItem.deleteMany({ _id: { $in: ticketItemIds } });

        await CartProduct.deleteMany({ _id: { $in: user.cart } }); // $in indicates to delete all the ids 'in' user
        await User.findById(userId, { $pull: { cart: { $exists: true } } })

        await Token.deleteOne({ userId: userId });

        //user's deletion
        await User.deleteOne({ _id: userId });

        return res.status(204).end();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};