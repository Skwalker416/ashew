const { Ticket } = require('../../models/ticket');
const { TicketItem } = require('../../models/ticket_item');


exports.getTickets = async function(_, res) {
    try {
        const tickets = await Ticket.find()
            .select('-statusHistory') //put in everything in everything EXCEPT the status history  from ../../models/ticket STATUS schema 
            .populate('user', 'firstName lastName email') //expand this id in to its reference collection
            .sort({ dateOrdered: -1 }) //order in newest to the newest
            .populate({
                path: 'TicketItems',
                populate: {
                    path: 'event',
                    select: 'name',
                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                }
            })
        if (!tickets) {
            return res.status(404).json({ message: 'Tickets not found!' })
        }
        return res.json(tickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.getTicketsCount = async function(req, res) {
    try {
        const count = await Ticket.countDocuments();
        if (!count) {
            return res.status(500).json({ message: 'Could not count tickets' }) //error status 500 because we are the ones making a mistake
        }
        return res.json({ count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};
exports.changeTicketStatus = async function(req, res) {
    try {
        const ticketed = req.params.id;
        const newStatus = req.body.status; //admin will send a new status in the request body

        let ticket = await Ticket.findById(orderId);
        if (!ticket) {
            return res.status(400).json({ message: 'Ticket not found' })
        }

        ticket.status = newStatus;
        if (!ticket.statusHistory.includes(ticket.status)) {
            ticket.statusHistory.push(ticket.status);
        }
        ticket.status = newStatus;
        ticket = await ticket.save();
        return res.json(ticket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.deleteTicket = async function(req, res) {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' })
        }
        for (const ticketItemId of ticket.ticketItems) {
            await TicketItem.findByIdAndDelete(ticketItemId);
            // how exactly are we doing this after deleting the ticket ??? Bc when we delete it actually gets the ticket back
        }
        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};