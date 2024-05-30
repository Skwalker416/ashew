// const { User } = require('../../models/user');
// const { Vendor } = require('../../models/vendor');
// const { EventOrganizer } = require('../../models/eventOrganizer');
// const { Order } = require('../../models/order');
// const { OrderItem } = require('../../models/order_item');
// const { Ticket } = require('../../models/ticket');
// const { TicketItem } = require('../../models/ticket_item');
// const { Token } = require('../')
//     // const { CartProduct } = require('../models/cart_product');


// exports.getUserCount = async function(req, res) {
//     try {
//         const userCount = await User.countDocuments();


//         if (!userCount && !vendorCount && !eventOrganizerCount) {
//             return res.status(500).json({ message: `Could not count User` });
//         }

//     } catch (errorh) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }

// };
// exports.getVendorCount = async function(req, res) {
//     try {
//         const vendorCount = await Vendor.countDocuments();


//         if (!vendorCount) {
//             return res.status(500).json({ message: `Could not count Vendor` });
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
//     s
// };

// exports.getEventOrganizerCount = async function(req, res) {
//     try {

//         const eventOrganizerCount = await EventOrganizer.countDocuments();


//         if (!eventOrganizerCount) {
//             return res.status(500).json({ message: `Could not count EventOrganizer` });
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }

// };
// exports.deleteUser = async function(req, res) {
//     try {
//         const userId = req.params.id; //gets user id form admin routes user:_id
//         const vendorId = req.params.id;
//         const eventOrganizerId = req.params.id;

//         const user = await User.findById(userId);
//         const vendor = await vendor.findById(vendorId);
//         const eventOrganizer = await EventOrganizer.findById(eventOrganizerId);

//         let entity = user || vendor || eventOrganizer;

//         // if (!user && !vendor && !eventOrganizer) {
//         if (!entity) {
//             return res.status(400).json({ message: `${entity} not found` });
//         };

//         //deleting orders/tickets where the user matches the userId
//         const orders = await Order.find({ user: userId });
//         const orderItemIds = orders.flatMap((order) = order.OrderItems)
//         const tickets = await Order.find({ user: userId });
//         const ticketItemIds = tickets.flatMap((ticket) = ticket.TicketItems)

//         await Order.deleteMany({ user: userId });
//         await OrderItem.deleteMany({ _id: { $in: orderItemIds } });

//         await Ticket.deleteMany({ user: userId });
//         await TicketItem.deleteMany({ _id: { $in: ticketItemIds } });

//         await CartProduct.deleteMany({ _id: { $in: user.cart } }); // $in indicates to delete all the ids 'in' user


//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };
// exports.deleteVendor = async function(req, res) {
//     try {
//         const vendorId = req.params.id;


//         const vendor = await vendor.findById(vendorId);


//         if (!vendor) {
//             return res.status(400).json({ message: `Vendor not found` });
//         };
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };

// exports.deleteEventOrganizer = async function(req, res) {
//     try {

//         const eventOrganizerId = req.params.id;


//         const eventOrganizer = await EventOrganizer.findById(eventOrganizerId);


//         if (!eventOrganizer) {
//             return res.status(400).json({ message: `Event Organizer not found` });
//         };
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ type: error.name, message: error.message });
//     }
// };