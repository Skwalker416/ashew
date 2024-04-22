const { EventOrganizer } = require("../../models/eventOrganizer");
const { Vendor } = require("../../models/vendor");
const { User } = require('../../models/user');
const { Order } = require('../../models/order');
const { OrderItem } = require('../../models/order_item');
const { Ticket } = require('../../models/ticket');
const { TicketItem } = require('../../models/ticket_item');
const { Token } = require('../../models/token')
exports.getEventOrganizerCount = async function(req, res) {
    try {

        const eventOrganizerCount = await EventOrganizer.countDocuments();


        if (!eventOrganizerCount) {
            return res.status(500).json({ message: `Could not count EventOrganizer` });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }

};

exports.deleteEventOrganizer = async function(req, res) {
    try {

        const eventOrganizerId = req.params.id;


        const eventOrganizer = await EventOrganizer.findById(eventOrganizerId);


        if (!eventOrganizer) {
            return res.status(400).json({ message: `Event Organizer not found` });
        };

        await Token.deleteOne({ eventOrganizerId: eventOrganizerId }); //user's deletion

        await EventOrganizer.deleteOne({ _id: eventOrganizerId });
        return res.status(204).end();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};