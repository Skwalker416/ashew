const { User } = require('../../models/user');
const { Vendor } = require("../../models/vendor");
const { EventOrganizer } = require('../../models/eventOrganizer');
const { Order } = require('../../models/order');
const { OrderItem } = require('../../models/order_item');
const { Ticket } = require('../../models/ticket');
const { TicketItem } = require('../../models/ticket_item');
const { Token } = require('../../models/token')


exports.getVendorCount = async function(req, res) {
    try {
        const vendorCount = await Vendor.countDocuments();


        if (!vendorCount) {
            return res.status(500).json({ message: `Could not count Vendor` });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }

};

exports.deleteVendor = async function(req, res) {
    try {
        const vendorId = req.params.id;


        const vendor = await vendor.findById(vendorId);


        if (!vendor) {
            return res.status(400).json({ message: `Vendor not found` });
        };
        await Token.deleteOne({ vendorId: vendorId }); //user's deletion

        await Vendor.deleteOne({ _id: vendorId });
        return res.status(204).end();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};