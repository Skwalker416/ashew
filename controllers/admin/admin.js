const { Token } = require('../../models/token');
const { User } = require('../../models/user');
const { Order } = require('../../models/order');
const { OrderItem } = require('../../models/order_item');
const { Ticket } = require('../../models/ticket');
const { TicketItem } = require('../../models/ticket_item');
// const { Admin } = require('../../models/admin');

const getUserById = async(req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const getDashboard = (req, res) => {
    const dashboardData = {
        usersCount: 10, // Example data
        vendorsCount: 5,
        eventOrganizersCount: 3,
    };
    res.render('admin/dashboard', { title: 'Dashboard', data: dashboardData });
};

module.exports = {
    getDashboard,
    getUserById
};