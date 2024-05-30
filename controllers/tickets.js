const { default: mongoose } = require('mongoose');
const { Event } = require('../models/event');
const { CartEvent } = require('../models/cart_event');
const { TicketItem } = require('../models/ticket_item');
const { Ticket } = require('../models/ticket');
const { User } = require('../models/user');
exports.addTicket = async function(ticketData) {
    if (!mongoose.isValidObjectId(ticketData.user)) {
        return console.error('User validation failed: Invalid user!')
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(ticketData.user);
        if (!user) {
            await session.abortTransaction();
            return console.trace('TICKET CREATION FAILED: user nor found');

        }
        const ticketItems = ticketData.ticketItems;
        const ticketItemsIds = [];

        for (const ticketItem of ticketItems) {

            if (!mongoose.isValidObjectId(ticketItem.event) || !(await Event.findById(ticketItem.event))) {
                await session.abortTransaction();
                return console.trace('TICKET CREATION FAILED: Invalid event in the ticket');
                // Exit the function after aborting the transaction
            }

            const event = await Event.findById(ticketItem.event);


            const cartEvent = await CartEvent.findById(ticketItems.cartEvent);
            if (!cartEvent) {
                await session.abortTransaction();
                return console.trace('TICKET CREATION FAILED: Invalid cart event in the ticket');

            }
            let ticketItemModel = await new TicketItem(ticketItem).save({ session });


            if (!ticketItemModel) {
                await session.abortTransaction();
                console.trace('TICKET CREATION FAILED:', `An ticket for "${event.name }" could not be created`);
            }

            if (!cartEvent.reserved) {
                event.countInStock -= ticketItemModel.quantity;
                await event.save({ session });
            }
            ticketItemsIds.push(ticketItemModel._id);


            await cartEvent.findByIdAndDelete(ticketItem.cartEventId).session(session);

            user.cart.pull(cartEvent.id);
            await user.save({ session });

        }

        ticketData['ticketItems'] = ticketItemsIds; //replaced the ticket item and going to use the ids to create ticket
        let ticket = new Ticket(ticketData);
        ticket.status = 'processed';
        ticket.statusHistory.push('processed'); //going to change from pending to processed 

        ticket = await ticket.save({ session });

        if (!ticket) {
            await session.abortTransaction();
            return console.trace('TICKET CREATION FAILED: The ticket could not be created.');

        }

        await session.commitTransaction();
        return ticket;
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return console.trace(error);
    } finally {
        await session.endSession();
    }

}

exports.getUserTickets = async function(req, res) {
    try {
        const tickets = await Ticket.find({ user: req.params.userId })
            .select('ticketItems status totalPrice dateTicketed')
            .populate({ path: 'ticketItems', select: 'eventName, eventImage' })
            .sort({ dateTicketed: -1 });

        if (!tickets) {
            return res.status(404).json({ message: 'Event not found' })
        }
        const completed = [];
        const active = [];
        const cancelled = [];
        for (const ticket of tickets) {
            if (ticket.status === 'delivered') {
                completed.push(tickets);
            } else if (['canceled', 'expired'].includes(ticket.status)) {
                cancelled.push(ticket);
            } else {
                active.push(ticket);
            }
        }

        return res.json({ total: tickets.length, active, completed, cancelled });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.getTicketById = async function(req, res) {
    try {

        const ticket = await Ticket.findById(req.params.id).populate('ticketItems');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });

        }
        return res.json(ticket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
}